import React, { useState, useEffect } from 'react';
import { FiSave, FiChevronDown, FiChevronUp, FiUpload, FiLock, FiCheckCircle, FiAlertCircle, FiVideo, FiTrash2 } from 'react-icons/fi';
import { useToast } from '../context/ToastContext';
import { processImageFile } from '../utils/imageUpload';

const API = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://backend-three-beta-90.vercel.app';

const Section = ({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-5 sm:px-6 py-4 hover:bg-slate-50/80 transition-colors"
      >
        <h3 className="text-sm sm:text-base font-bold text-slate-800 text-left">{title}</h3>
        {open ? <FiChevronUp className="text-slate-400 flex-shrink-0" /> : <FiChevronDown className="text-slate-400 flex-shrink-0" />}
      </button>
      {open && <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100 space-y-4">{children}</div>}
    </div>
  );
};

const Field = ({ label, value, onChange, placeholder = '', multiline = false, type = 'text' }: any) => (
  <div>
    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
    {multiline ? (
      <textarea
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
      />
    ) : (
      <input
        type={type}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
      />
    )}
  </div>
);

const ImageField = ({ label, value, fieldKey, onChange }: { label: string; value: string; fieldKey: string; onChange: (key: string, url: string) => void }) => {
  const { showSuccess, showError } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    try {
      const result = await processImageFile(file, {
        maxSizeMB: 10,
        maxWidth: 1920,
        maxHeight: 1280,
        quality: 0.85
      });

      if (!result.success || !result.dataUrl) {
        showError('Gagal Memproses Gambar', result.error || 'Gambar tidak valid.');
        return;
      }

      onChange(fieldKey, result.dataUrl);
      showSuccess(
        'Gambar Berhasil Diunggah!',
        `Foto "${label}" berhasil diupload (${result.width}x${result.height}px, ${result.compressedSizeKB} KB).`
      );
    } catch (err: any) {
      showError('Gagal Upload', err?.message || 'Terjadi kesalahan saat memproses gambar.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const previewSrc = value 
    ? (value.startsWith('http') || value.startsWith('data:') ? value : encodeURI(value.startsWith('/') ? value : '/' + value))
    : null;

  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <label className="block text-xs sm:text-sm font-semibold text-slate-700">{label}</label>
        <span className="text-[11px] text-slate-400">JPG, PNG, WEBP (Maks 10MB)</span>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {previewSrc && (
          <div className="relative group flex-shrink-0">
            <img src={previewSrc} alt="Preview" className="w-24 h-16 object-cover rounded-xl border border-slate-200 shadow-sm" />
            <button
              type="button"
              onClick={() => onChange(fieldKey, '')}
              className="absolute -top-1.5 -right-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full p-1 shadow transition-colors"
              title="Hapus gambar"
            >
              <FiTrash2 size={11} />
            </button>
          </div>
        )}
        <label className="cursor-pointer flex items-center justify-center gap-2 bg-slate-50 hover:bg-blue-50 border-2 border-dashed border-slate-300 hover:border-blue-400 text-slate-600 hover:text-blue-600 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all">
          <FiUpload />
          {uploading ? 'Memproses Gambar...' : 'Pilih Gambar Baru'}
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>
    </div>
  );
};

const Settings = () => {
  const { showSuccess, showError } = useToast();
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch(`${API}/api/data`)
      .then(res => res.json())
      .then(data => { setSettings(data.settings || {}); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const set = (key: string, value: string) => setSettings((prev: any) => ({ ...prev, [key]: value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      const res = await fetch(`${API}/api/update/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (!res.ok) throw new Error('Gagal menyimpan ke server');
      setSavedSuccess(true);
      showSuccess('Pengaturan Tersimpan', 'Semua perubahan pengaturan & gambar berhasil disimpan ke database!');
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch {
      showError('Gagal Menyimpan', 'Terjadi kesalahan saat menyimpan pengaturan ke server.');
    }
    setSaving(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg(null);

    if (newPassword !== confirmPassword) {
      setPwdMsg({ type: 'error', text: 'Konfirmasi kata sandi baru tidak cocok' });
      return;
    }

    if (newPassword.length < 6) {
      setPwdMsg({ type: 'error', text: 'Kata sandi minimal 6 karakter' });
      return;
    }

    setPwdLoading(true);

    try {
      const storedUser = localStorage.getItem('admin_user');
      const email = storedUser ? JSON.parse(storedUser).email : 'admin@rayakonstruksi.com';

      const res = await fetch(`${API}/api/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          currentPassword,
          newPassword
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setPwdMsg({ type: 'error', text: data.error || 'Gagal mengubah kata sandi' });
      } else {
        setPwdMsg({ type: 'success', text: 'Kata sandi akun admin berhasil diperbarui!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch {
      setPwdMsg({ type: 'error', text: 'Gagal menghubungi server' });
    }

    setPwdLoading(false);
  };

  if (loading) return <div className="text-slate-500 text-sm py-8 text-center">Loading data pengaturan...</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="mb-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Pengaturan Lengkap Website</h2>
        <p className="text-slate-500 mt-1 text-xs sm:text-sm leading-relaxed">
          Ubah semua konten teks, gambar banner hero, video tentang kami, kontak, dan kredensial akun admin.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm">
          <FiCheckCircle className="text-emerald-600 flex-shrink-0" size={18} />
          <span>Semua pengaturan berhasil disimpan dan langsung aktif di website!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">

        {/* 1. Hero Section Banners */}
        <Section title="1. Hero Banner Slider (3 Slide Utama)" defaultOpen>
          <div className="space-y-6">
            {/* Slide 1 */}
            <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3.5">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100/70 px-2.5 py-1 rounded-md">Slide 1</span>
              <Field label="Tagline Label Atas (Badge)" value={settings.heroTag1} onChange={(v: string) => set('heroTag1', v)} placeholder="Misal: ARCHITECTURE & DESIGN" />
              <Field label="Judul Utama Slide 1" value={settings.heroTitle} onChange={(v: string) => set('heroTitle', v)} placeholder="Misal: Membangun Masa Depan Presisi & Berkualitas" />
              <Field label="Deskripsi / Sub-judul Slide 1" value={settings.heroDesc} onChange={(v: string) => set('heroDesc', v)} placeholder="Deskripsi singkat slide 1..." multiline />
              <ImageField label="Foto Background Slide 1" value={settings.heroImage} fieldKey="heroImage" onChange={set} />
            </div>

            {/* Slide 2 */}
            <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3.5">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100/70 px-2.5 py-1 rounded-md">Slide 2</span>
              <Field label="Tagline Label Atas (Badge)" value={settings.heroTag2} onChange={(v: string) => set('heroTag2', v)} placeholder="Misal: COMMERCIAL & TOWER" />
              <Field label="Judul Utama Slide 2" value={settings.heroTitle2} onChange={(v: string) => set('heroTitle2', v)} placeholder="Misal: Konstruksi Megah Komersial & Perkantoran" />
              <Field label="Deskripsi / Sub-judul Slide 2" value={settings.heroDesc2} onChange={(v: string) => set('heroDesc2', v)} placeholder="Deskripsi singkat slide 2..." multiline />
              <ImageField label="Foto Background Slide 2" value={settings.heroImage2} fieldKey="heroImage2" onChange={set} />
            </div>

            {/* Slide 3 */}
            <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3.5">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100/70 px-2.5 py-1 rounded-md">Slide 3</span>
              <Field label="Tagline Label Atas (Badge)" value={settings.heroTag3} onChange={(v: string) => set('heroTag3', v)} placeholder="Misal: CIVIL & INFRASTRUCTURE" />
              <Field label="Judul Utama Slide 3" value={settings.heroTitle3} onChange={(v: string) => set('heroTitle3', v)} placeholder="Misal: Infrastruktur Vital & Fabrikasi Industri" />
              <Field label="Deskripsi / Sub-judul Slide 3" value={settings.heroDesc3} onChange={(v: string) => set('heroDesc3', v)} placeholder="Deskripsi singkat slide 3..." multiline />
              <ImageField label="Foto Background Slide 3" value={settings.heroImage3} fieldKey="heroImage3" onChange={set} />
            </div>
          </div>
        </Section>

        {/* 2. About Section & Video Showcase */}
        <Section title="2. Tentang Kami & Video Showcase (About Us)">
          <div className="space-y-4">
            {/* Video Configuration */}
            <div className="p-4 bg-blue-50/60 border border-blue-200/80 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
                <FiVideo size={18} />
                <span>Video Showcase Tentang Kami</span>
              </div>
              <Field 
                label="Link Video (YouTube URL atau File MP4)" 
                value={settings.aboutVideo} 
                onChange={(v: string) => set('aboutVideo', v)} 
                placeholder="Misal: https://www.youtube.com/watch?v=... atau /construction-video.mp4" 
              />
              <p className="text-xs text-slate-500 leading-relaxed">
                💡 <strong>Tips:</strong> Anda bisa memasukkan link video YouTube langsung (misal: <code>https://www.youtube.com/watch?v=...</code> atau <code>https://youtu.be/...</code>) atau file video lokal <code>/construction-video.mp4</code>.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Badge Label Atas" value={settings.aboutBadge} onChange={(v: string) => set('aboutBadge', v)} placeholder="Behind The Blueprint" />
              <Field label="Nama Perusahaan (Heading Utama)" value={settings.aboutTitle} onChange={(v: string) => set('aboutTitle', v)} placeholder="Raya Konstruksi Jaya" />
            </div>

            <Field label="Kisah Perusahaan (Paragraf 1)" value={settings.aboutStory} onChange={(v: string) => set('aboutStory', v)} multiline />
            <Field label="Kisah Perusahaan (Paragraf 2)" value={settings.aboutStory2} onChange={(v: string) => set('aboutStory2', v)} multiline />

            <div className="pt-2 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Visi & Misi Perusahaan</h4>
              <Field label="Judul Visi" value={settings.visionTitle} onChange={(v: string) => set('visionTitle', v)} placeholder="Pioneering Sustainable Horizons" />
              <Field label="Deskripsi Visi" value={settings.visionDesc} onChange={(v: string) => set('visionDesc', v)} multiline />
              <Field label="Misi Poin 1" value={settings.mission1} onChange={(v: string) => set('mission1', v)} multiline />
              <Field label="Misi Poin 2" value={settings.mission2} onChange={(v: string) => set('mission2', v)} multiline />
              <Field label="Misi Poin 3" value={settings.mission3} onChange={(v: string) => set('mission3', v)} multiline />
            </div>
          </div>
        </Section>

        {/* 3. Section Titles & Descriptions */}
        <Section title="3. Judul & Deskripsi Bagian Lain (Headings)">
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <span className="text-xs font-bold text-slate-600 uppercase">Kenapa Memilih Kami (Why Us)</span>
              <Field label="Judul Section" value={settings.whyTitle} onChange={(v: string) => set('whyTitle', v)} placeholder="Kenapa Memilih Kami?" />
              <Field label="Deskripsi Section" value={settings.whyDesc} onChange={(v: string) => set('whyDesc', v)} multiline />
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <span className="text-xs font-bold text-slate-600 uppercase">Bidang Keahlian / Layanan</span>
              <Field label="Judul Section" value={settings.servicesTitle} onChange={(v: string) => set('servicesTitle', v)} placeholder="Bidang Keahlian Kami" />
              <Field label="Deskripsi Section" value={settings.servicesDesc} onChange={(v: string) => set('servicesDesc', v)} multiline />
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <span className="text-xs font-bold text-slate-600 uppercase">Klien & Mitra</span>
              <Field label="Judul Section" value={settings.clientsTitle} onChange={(v: string) => set('clientsTitle', v)} placeholder="Klien & Mitra Kami" />
              <Field label="Deskripsi Section" value={settings.clientsDesc} onChange={(v: string) => set('clientsDesc', v)} multiline />
            </div>
          </div>
        </Section>

        {/* 4. Contact & Company Info */}
        <Section title="4. Informasi Kontak & Perusahaan">
          <div className="space-y-4">
            <ImageField label="Gambar Background Banner Kontak" value={settings.contactImage} fieldKey="contactImage" onChange={set} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Judul Kontak" value={settings.contactTitle} onChange={(v: string) => set('contactTitle', v)} placeholder="Siap Memulai Proyek Anda?" />
              <Field label="Nama Resmi Perusahaan" value={settings.companyName} onChange={(v: string) => set('companyName', v)} placeholder="Raya Konstruksi Jaya" />
            </div>
            <Field label="Deskripsi Kontak" value={settings.contactDesc} onChange={(v: string) => set('contactDesc', v)} multiline />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Field label="Nomor WhatsApp Resmi (tanpa +)" value={settings.whatsappNumber} onChange={(v: string) => set('whatsappNumber', v)} placeholder="6281234567890" type="tel" />
              <Field label="Alamat Email Resmi" value={settings.emailAddress} onChange={(v: string) => set('emailAddress', v)} placeholder="contact@rayakonstruksi.com" type="email" />
              <Field label="Akun Instagram (tanpa @)" value={settings.instagram} onChange={(v: string) => set('instagram', v)} placeholder="rayakonstruksijaya" />
              <Field label="Akun Telegram (tanpa @)" value={settings.telegram} onChange={(v: string) => set('telegram', v)} placeholder="rayakonstruksijaya" />
              <Field label="Slogan / Brand Tagline" value={settings.brandTagline} onChange={(v: string) => set('brandTagline', v)} placeholder="Membangun Keunggulan Mutu" />
              <Field label="Alamat Kantor Pusat" value={settings.companyAddress} onChange={(v: string) => set('companyAddress', v)} placeholder="Surakarta, Jawa Tengah, Indonesia" />
            </div>
          </div>
        </Section>

        {/* Sticky Save All Changes Bar */}
        <div className="sticky bottom-4 z-20 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-900/30 text-sm sm:text-base cursor-pointer"
          >
            <FiSave size={18} />
            <span>{saving ? 'Menyimpan Perubahan...' : 'Simpan Semua Perubahan Konten'}</span>
          </button>
        </div>
      </form>

      {/* 5. Change Password Form (Secure) */}
      <div className="mt-10 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-base sm:text-lg border-b border-slate-100 pb-3">
          <FiLock className="text-blue-600" />
          <span>Keamanan: Ganti Kata Sandi Akun Admin</span>
        </div>

        {pwdMsg && (
          <div className={`p-3.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 ${
            pwdMsg.type === 'success' 
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {pwdMsg.type === 'success' ? <FiCheckCircle className="flex-shrink-0" /> : <FiAlertCircle className="flex-shrink-0" />}
            <span>{pwdMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kata Sandi Saat Ini</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kata Sandi Baru</label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Konfirmasi Sandi Baru</label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Ulangi sandi baru"
                className="w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={pwdLoading}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {pwdLoading ? 'Memproses...' : 'Perbarui Kata Sandi'}
          </button>
        </form>
      </div>

    </div>
  );
};

export default Settings;
