import React, { useState } from 'react';
import { FiBox, FiLock, FiMail, FiCheck, FiArrowLeft, FiAlertCircle, FiKey } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const API = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://backend-three-beta-90.vercel.app';

const Login = () => {
  const navigate = useNavigate();
  // State: 'login' | 'forgot' | 'verify_pin' | 'success'
  const [view, setView] = useState<'login' | 'forgot' | 'verify_pin' | 'success'>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [resetEmail, setResetEmail] = useState('');
  const [pin, setPin] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Email atau kata sandi salah');
        setLoading(false);
        return;
      }

      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      navigate('/');
    } catch {
      setError('Gagal menghubungi server autentikasi');
    }
    setLoading(false);
  };

  // 2. Handle Minta PIN Reset
  const handleRequestPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail })
      });
      const data = await res.json();
      if (data.success) {
        setView('verify_pin');
      } else {
        setError(data.error || 'Gagal mengirim kode pemulihan');
      }
    } catch {
      setError('Gagal menghubungi server');
    }
    setLoading(false);
  };

  // 3. Handle Masukkan PIN & Set Password Baru
  const handleResetPasswordWithPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: resetEmail,
          pin,
          newPassword
        })
      });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg('Kata sandi berhasil diperbarui! Silakan masuk dengan kata sandi baru Anda.');
        setView('success');
      } else {
        setError(data.error || 'Kode PIN salah atau gagal mereset');
      }
    } catch {
      setError('Gagal memproses reset sandi');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      {/* Background Lighting Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full relative z-10 bg-slate-800/80 backdrop-blur-xl p-8 sm:p-10 rounded-2xl shadow-2xl border border-slate-700/60">

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl overflow-hidden flex items-center justify-center p-1.5 text-white shadow-xl shadow-blue-900/50 mb-4 border border-blue-400/30">
            <img src="/Profil.png" alt="Raya Konstruksi Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Raya<span className="text-blue-400">.</span> Workspace
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {view === 'login' && 'Masuk ke Content Management System'}
            {view === 'forgot' && 'Kirim Kode Pemulihan ke Email'}
            {view === 'verify_pin' && 'Masukkan Kode 6-Digit & Sandi Baru'}
            {view === 'success' && 'Pemulihan Sandi Berhasil'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm">
            <FiAlertCircle className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. TAMPILAN LOGIN UTAMA */}
        {view === 'login' && (
          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Email Admin</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                  placeholder="admin@rayakonstruksi.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Kata Sandi</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
              <label className="flex items-center text-slate-400 cursor-pointer select-none">
                <input type="checkbox" defaultChecked className="mr-2 rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-blue-500" />
                Ingat saya
              </label>
              <button
                type="button"
                onClick={() => { setView('forgot'); setError(''); }}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Lupa sandi?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-900/30 hover:shadow-blue-900/50 transition-all duration-200 text-sm mt-2"
            >
              {loading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}
            </button>
          </form>
        )}

        {/* 2. TAMPILAN INPUT EMAIL LUPA PASSWORD */}
        {view === 'forgot' && (
          <div className="space-y-5">
            <form onSubmit={handleRequestPin} className="space-y-4">
              <p className="text-sm text-slate-300 leading-relaxed">
                Masukkan email Anda. Kami akan mengirimkan <strong>Kode Verifikasi 6-Digit</strong> ke email Anda.
              </p>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Email Akun Admin</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full bg-slate-900/60 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                    placeholder="admin@rayakonstruksi.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold py-3 px-4 rounded-xl transition-colors text-sm"
              >
                {loading ? 'Mengirim Kode...' : 'Kirim Kode Verifikasi'}
              </button>
            </form>

            <button
              type="button"
              onClick={() => { setView('login'); setError(''); }}
              className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-white text-sm py-2 transition-colors"
            >
              <FiArrowLeft /> Kembali ke Halaman Login
            </button>
          </div>
        )}

        {/* 3. TAMPILAN MASUKKAN PIN & PASSWORD BARU */}
        {view === 'verify_pin' && (
          <div className="space-y-5">
            <form onSubmit={handleResetPasswordWithPin} className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-lg text-blue-300 text-xs leading-relaxed">
                Kode 6-Digit telah dikirim ke email Anda. Masukkan kode tersebut dan buat kata sandi baru di bawah ini.
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Kode PIN 6-Digit</label>
                <div className="relative">
                  <FiKey className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full bg-slate-900/60 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white font-mono tracking-widest text-center text-lg placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="123456"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Kata Sandi Baru</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-900/60 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                    placeholder="Minimal 6 karakter"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-500 disabled:bg-green-800 text-white font-bold py-3 px-4 rounded-xl transition-colors text-sm"
              >
                {loading ? 'Menyimpan Sandi...' : 'Simpan & Reset Kata Sandi'}
              </button>
            </form>

            <button
              type="button"
              onClick={() => { setView('forgot'); setError(''); }}
              className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-white text-sm py-2 transition-colors"
            >
              <FiArrowLeft /> Kirim Ulang Kode / Ganti Email
            </button>
          </div>
        )}

        {/* 4. TAMPILAN SUKSES RESET */}
        {view === 'success' && (
          <div className="text-center py-4 space-y-5">
            <div className="w-14 h-14 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto text-2xl">
              <FiCheck />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Berhasil Direset!</h3>
              <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                {successMsg}
              </p>
            </div>
            <button
              type="button"
              onClick={() => { setView('login'); setError(''); }}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl transition-colors text-sm"
            >
              Masuk Sekarang
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Login;
