import React, { useState } from 'react';
import { FiBox, FiLock, FiMail, FiCheck, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const API = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://backend-three-beta-90.vercel.app';

const Login = () => {
  const navigate = useNavigate();
  const [isForgot, setIsForgot] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

      // Simpan JWT token & data user sungguhan
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      setError('Gagal menghubungi server autentikasi');
    }
    setLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail })
      });
      const data = await res.json();
      if (data.success) {
        setResetSent(true);
      } else {
        setError(data.error || 'Gagal mengirim instruksi reset');
      }
    } catch {
      setError('Gagal menghubungi server');
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
          <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-900/50 mb-4">
            <FiBox size={32} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Raya<span className="text-blue-400">.</span> Workspace
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {isForgot ? 'Pemulihan Akun & Kata Sandi' : 'Masuk ke Content Management System'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm">
            <FiAlertCircle className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!isForgot ? (
          /* FORM LOGIN */
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
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all" 
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
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all" 
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
                onClick={() => { setIsForgot(true); setError(''); }}
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
        ) : (
          /* FORM LUPA PASSWORD */
          <div className="space-y-5">
            {!resetSent ? (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <p className="text-sm text-slate-300 leading-relaxed">
                  Masukkan email akun admin Anda yang terdaftar di database. Kami akan memproses verifikasi pemulihan kata sandi.
                </p>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Email Terdaftar</label>
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
                  {loading ? 'Memproses...' : 'Kirim Permintaan Reset Sandi'}
                </button>
              </form>
            ) : (
              <div className="text-center py-4 space-y-4">
                <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto text-xl">
                  <FiCheck />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Permintaan Terverifikasi!</h3>
                  <p className="text-slate-400 text-xs mt-1">
                    Instruksi reset kata sandi telah diproses untuk <span className="text-blue-400">{resetEmail}</span>.
                  </p>
                </div>
              </div>
            )}

            <button 
              type="button" 
              onClick={() => { setIsForgot(false); setResetSent(false); setError(''); }}
              className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-white text-sm py-2 transition-colors"
            >
              <FiArrowLeft /> Kembali ke Halaman Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
