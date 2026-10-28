require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const JWT_SECRET = process.env.JWT_SECRET || 'raya_super_secret_jwt_key_2026';

// Storage for uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Connect to MongoDB Atlas with Serverless Connection Cache
const MONGODB_URI = process.env.MONGODB_URI;

let connectPromise = null;
async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  if (!connectPromise) {
    connectPromise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    }).then(() => {
      console.log(' Connected to MongoDB Atlas!');
      connectPromise = null;
    }).catch(err => {
      connectPromise = null;
      throw err;
    });
  }
  return connectPromise;
}

// Middleware to ensure DB connection before any API request
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('DB connection error:', err);
  }
  next();
});

// MongoDB Schema for Users (Real Auth) - includes sessionToken for single-session enforcement
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: 'Admin' },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
  sessionToken: { type: String, default: null } // Active session token - invalidated on new login
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// MongoDB Schema for all website content
const contentSchema = new mongoose.Schema({
  _id: { type: String, default: 'main_content' },
  services: { type: Array, default: [] },
  reasons: { type: Array, default: [] },
  projects: { type: Array, default: [] },
  clients: { type: Array, default: [] },
  reviews: { type: Array, default: [] },
  settings: { type: Object, default: {} }
}, { strict: false, timestamps: true });

const Content = mongoose.model('Content', contentSchema, 'content');

// Helper to get database data with local fallback
async function getDbData() {
  try {
    const doc = await Content.findById('main_content').lean();
    if (doc) {
      if (!Array.isArray(doc.reviews)) doc.reviews = [];
      return doc;
    }
  } catch (e) {
    console.error('Error reading from MongoDB, fallback to local data.json:', e);
  }
  const DB_FILE = path.join(__dirname, 'data.json');
  if (fs.existsSync(DB_FILE)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      if (!Array.isArray(parsed.reviews)) parsed.reviews = [];
      return parsed;
    } catch (e) {}
  }
  return { services: [], reasons: [], projects: [], clients: [], reviews: [], settings: {} };
}

// ========================================================
// AUTH MIDDLEWARE - Validates JWT + Session Token in DB
// If a new login occurred elsewhere, this will return 401
// ========================================================
const requireAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Tidak terautentikasi. Silakan login kembali.', code: 'NO_TOKEN' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if sessionToken in JWT matches the one stored in DB
    // If not, this means a new login occurred elsewhere → kick this session out
    const user = await User.findById(decoded.userId).select('sessionToken email name');
    if (!user) {
      return res.status(401).json({ error: 'Akun tidak ditemukan.', code: 'USER_NOT_FOUND' });
    }

    if (!decoded.sessionToken || user.sessionToken !== decoded.sessionToken) {
      return res.status(401).json({
        error: 'Sesi Anda telah diakhiri karena akun ini masuk dari perangkat lain.',
        code: 'SESSION_INVALIDATED'
      });
    }

    req.user = { userId: decoded.userId, email: decoded.email, name: decoded.name };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Sesi telah berakhir. Silakan login kembali.', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ error: 'Token tidak valid.', code: 'INVALID_TOKEN' });
  }
};

// --- AUTH API ROUTES ---

// LOGIN (Real DB verification + Single Session enforcement)
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email dan password wajib diisi' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ error: 'Email atau kata sandi salah' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Email atau kata sandi salah' });
    }

    // Generate new unique session token → invalidates any existing session
    const newSessionToken = crypto.randomBytes(32).toString('hex');
    user.sessionToken = newSessionToken;
    await user.save();

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        name: user.name,
        sessionToken: newSessionToken // Embed session token in JWT
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: { email: user.email, name: user.name }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan server saat login' });
  }
});

// VERIFY SESSION - Called by frontend to check if session is still valid
app.get('/api/auth/verify', requireAuth, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// FORGOT PASSWORD (Real Email Dispatch via Resend)
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email wajib diisi' });

  const targetEmail = (email.toLowerCase().trim() === 'admin@rayakonstruksi.com' || email.toLowerCase().trim() === 'fikihrz3135@gmail.com') 
    ? 'fikihrz3135@gmail.com' 
    : email.toLowerCase().trim();

  const resetPin = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    if (mongoose.connection.readyState >= 1) {
      await User.updateOne(
        { email: email.toLowerCase().trim() },
        { $set: { resetToken: resetPin, resetTokenExpiry: new Date(Date.now() + 3600000) } }
      );
    }
  } catch (dbErr) {
    console.error('DB update token error:', dbErr);
  }

  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    const { Resend } = require('resend');
    const resend = new Resend(resendApiKey);

    const emailResult = await resend.emails.send({
      from: 'Raya Workspace <onboarding@resend.dev>',
      to: [targetEmail],
      subject: '\uD83D\uDD10 Kode Pemulihan Kata Sandi - Raya Workspace',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #ffffff; padding: 30px; border-radius: 12px;">
          <h2 style="color: #38bdf8; margin-top: 0;">Raya. Workspace</h2>
          <p style="color: #cbd5e1; font-size: 15px;">Halo Administrator,</p>
          <p style="color: #cbd5e1; font-size: 14px;">Kami menerima permintaan pemulihan kata sandi untuk akun <strong>${email}</strong>.</p>
          <div style="background: #1e293b; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0; border: 1px solid #334155;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Kode Verifikasi Reset Sandi:</p>
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #38bdf8;">${resetPin}</span>
          </div>
          <p style="color: #94a3b8; font-size: 13px;">Kode verifikasi ini berlaku selama <strong>60 menit</strong>. Jika Anda tidak meminta reset sandi ini, abaikan email ini.</p>
          <hr style="border: 0; border-top: 1px solid #334155; margin: 25px 0;" />
          <p style="color: #64748b; font-size: 11px; margin: 0;">PT Raya Konstruksi Jaya &bull; Sistem Manajemen Keamanan Akun</p>
        </div>
      `
    });

    if (emailResult.error) {
      return res.status(500).json({ error: 'Gagal mengirim email: ' + emailResult.error.message });
    }

    return res.json({
      success: true,
      message: `Kode pemulihan telah dikirim ke email terdaftar.`
    });
  } catch (err) {
    console.error('Forgot password email dispatch error:', err);
    return res.status(500).json({ error: 'Gagal mengirim email pemulihan: ' + err.message });
  }
});

// RESET PASSWORD WITH PIN
app.post('/api/auth/reset-password', async (req, res) => {
  const { email, pin, newPassword } = req.body;
  if (!email || !pin || !newPassword) {
    return res.status(400).json({ error: 'Email, kode PIN, dan kata sandi baru wajib diisi' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Kata sandi baru minimal 6 karakter' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ error: 'Pengguna tidak ditemukan' });
    }

    if (!user.resetToken || user.resetToken !== pin.trim()) {
      return res.status(400).json({ error: 'Kode verifikasi 6-digit salah' });
    }

    if (user.resetTokenExpiry && new Date() > user.resetTokenExpiry) {
      return res.status(400).json({ error: 'Kode verifikasi sudah kedaluwarsa' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.json({ success: true, message: 'Kata sandi berhasil direset! Silakan login.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Gagal mereset kata sandi: ' + err.message });
  }
});

// CHANGE PASSWORD
app.post('/api/auth/change-password', requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Semua field wajib diisi' });
  }

  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Kata sandi saat ini salah' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true, message: 'Kata sandi berhasil diperbarui' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ error: 'Gagal mengubah kata sandi' });
  }
});

// --- CONTENT API ROUTES ---

// GET full website data (public - for frontend display)
app.get('/api/data', async (req, res) => {
  const data = await getDbData();
  res.json(data);
});

// UPDATE category in MongoDB Atlas (PROTECTED - requires valid session)
app.post('/api/update/:category', requireAuth, async (req, res) => {
  const category = req.params.category;
  const updateData = req.body;

  try {
    const updatedDoc = await Content.findByIdAndUpdate(
      'main_content',
      { [category]: updateData },
      { new: true, upsert: true }
    ).lean();

    try {
      const DB_FILE = path.join(__dirname, 'data.json');
      fs.writeFileSync(DB_FILE, JSON.stringify(updatedDoc, null, 2));
    } catch (err) {}

    res.json({ success: true, data: updatedDoc[category] });
  } catch (err) {
    console.error(`Failed to update ${category}:`, err);
    res.status(500).json({ error: `Failed to update ${category}` });
  }
});

// SUBMIT CLIENT REVIEW (Public API - from main website)
app.post('/api/reviews', async (req, res) => {
  const { name, company, role, review, rating, projectType } = req.body;
  if (!name || !review) {
    return res.status(400).json({ error: 'Nama dan ulasan wajib diisi' });
  }

  try {
    const newReview = {
      id: Date.now(),
      name: name.trim(),
      company: company ? company.trim() : 'Klien Privat',
      role: role ? role.trim() : 'Owner Proyek',
      projectType: projectType || 'Konstruksi',
      rating: Number(rating) || 5,
      review: review.trim(),
      date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }),
      createdAt: new Date()
    };

    await Content.findByIdAndUpdate(
      'main_content',
      { $push: { reviews: { $each: [newReview], $position: 0 } } },
      { upsert: true, new: true }
    );

    try {
      const DB_FILE = path.join(__dirname, 'data.json');
      const localData = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      if (!Array.isArray(localData.reviews)) localData.reviews = [];
      localData.reviews.unshift(newReview);
      fs.writeFileSync(DB_FILE, JSON.stringify(localData, null, 2));
    } catch (e) {}

    res.json({ success: true, review: newReview, message: 'Ulasan berhasil dikirim. Terima kasih!' });
  } catch (err) {
    console.error('Failed to submit review:', err);
    res.status(500).json({ error: 'Gagal mengirim ulasan' });
  }
});

// UPLOAD image file
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image provided' });
  const imageUrl = `https://backend-three-beta-90.vercel.app/uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
});

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(` Backend server running on port ${PORT}`);
  });
}

module.exports = app;
