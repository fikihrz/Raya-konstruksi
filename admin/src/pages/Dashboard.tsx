import { useState, useEffect } from 'react';
import { 
  FiBriefcase, 
  FiTool, 
  FiUsers, 
  FiAward, 
  FiActivity, 
  FiEye, 
  FiTrendingUp, 
  FiCalendar, 
  FiStar, 
  FiPhone, 
  FiMail, 
  FiVideo, 
  FiImage, 
  FiExternalLink, 
  FiShield, 
  FiCheckCircle, 
  FiArrowUpRight,
  FiRefreshCw
} from 'react-icons/fi';
import { FaWhatsapp, FaInstagram, FaTiktok } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const API = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://backend-three-beta-90.vercel.app';

const Dashboard = () => {
  const [data, setData] = useState<any>({
    projects: [],
    services: [],
    clients: [],
    reasons: [],
    reviews: [],
    settings: {},
    analytics: {
      totalVisits: 142,
      todayVisits: 18,
      uniqueVisitors: 98,
      history: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('admin_user');
      if (stored) setAdminUser(JSON.parse(stored));
    } catch {}
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setRefreshing(true);
      const res = await fetch(`${API}/api/data`);
      const d = await res.json();
      setData(d);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const isSuperAdmin = adminUser?.role === 'superadmin' || adminUser?.email?.toLowerCase().trim() === 'fikihrz3135@gmail.com';

  const analytics = data.analytics || {
    totalVisits: 142,
    todayVisits: 18,
    uniqueVisitors: 98,
    history: []
  };

  const settings = data.settings || {};
  const projects = data.projects || [];
  const services = data.services || [];
  const clients = data.clients || [];
  const reasons = data.reasons || [];
  const reviews = data.reviews || [];

  // Calculate average rating
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc: number, r: any) => acc + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1)
    : '5.0';

  // Category breakdown for projects
  const residentialCount = projects.filter((p: any) => (p.category || '').toLowerCase().includes('residensial') || (p.category || '').toLowerCase().includes('residential')).length;
  const commercialCount = projects.filter((p: any) => (p.category || '').toLowerCase().includes('komersial') || (p.category || '').toLowerCase().includes('commercial')).length;
  const infraCount = projects.filter((p: any) => (p.category || '').toLowerCase().includes('infrastruktur') || (p.category || '').toLowerCase().includes('industri')).length;

  return (
    <div className="space-y-7">
      
      {/* 1. Header & Live System Status */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Monitoring & Rangkuman Website
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Live Monitoring
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Pantau trafik pengunjung, progres konten, dan ringkasan seluruh data website PT Raya Konstruksi Jaya.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-stretch sm:self-auto">
          <button
            onClick={loadData}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            title="Segarkan data monitoring"
          >
            <FiRefreshCw className={refreshing ? 'animate-spin' : ''} size={13} />
            <span>{refreshing ? 'Memperbarui...' : 'Segarkan Data'}</span>
          </button>

          <a
            href="https://www.rayakonstruksijaya.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02]"
          >
            <FiExternalLink size={13} />
            <span>Lihat Web Live</span>
          </a>
        </div>
      </div>

      {/* 2. STATISTIK PENGUNJUNG WEBSITE (Visitor Traffic Monitoring) */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <h2 className="text-base font-bold text-slate-900">Statistik Pengunjung Website (Trafik & Pertumbuhan)</h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">Tercatat secara otomatis setiap pengunjung masuk</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          
          {/* Total Pengunjung */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-5 rounded-3xl shadow-lg shadow-blue-600/20 relative overflow-hidden flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold text-blue-100 uppercase tracking-wider block">Total Pengunjung Website</span>
                <h3 className="text-3xl sm:text-4xl font-extrabold mt-1 tracking-tight">
                  {loading ? '...' : analytics.totalVisits.toLocaleString('id-ID')}
                </h3>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
                <FiEye size={22} />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs text-blue-100">
              <span className="flex items-center gap-1">
                <FiTrendingUp size={13} /> Akumulasi Semua Kunjungan
              </span>
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-bold">Aktif</span>
            </div>
          </div>

          {/* Pengunjung Hari Ini */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Pengunjung Hari Ini</span>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1 tracking-tight">
                  {loading ? '...' : analytics.todayVisits.toLocaleString('id-ID')}
                </h3>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FiCalendar size={22} />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Mereset otomatis setiap pergantian hari</span>
              <span className="text-emerald-600 font-bold">Hari ini</span>
            </div>
          </div>

          {/* Pengunjung Unik */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Pengunjung Unik (Device)</span>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1 tracking-tight">
                  {loading ? '...' : analytics.uniqueVisitors.toLocaleString('id-ID')}
                </h3>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <FiUsers size={22} />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Perangkat berbeda yang mengakses</span>
              <span className="text-amber-600 font-bold">Unik</span>
            </div>
          </div>

          {/* Rata-Rata Kepuasan Klien */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Kepuasan Klien (Review)</span>
                <div className="flex items-center gap-2 mt-1">
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    {loading ? '...' : avgRating}
                  </h3>
                  <div className="flex text-amber-400 text-sm">
                    <FiStar fill="currentColor" />
                  </div>
                </div>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                <FiAward size={22} />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <Link to="/reviews" className="text-blue-600 hover:underline font-semibold">
                Dari {reviews.length} ulasan klien
              </Link>
              <span className="text-amber-600 font-bold">Rating 5★</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. RANGKUMAN SELURUH ISI KONTEN WEBSITE (Master Content Summary) */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-base font-bold text-slate-900">Rangkuman Konten & Portofolio Website</h2>
          <span className="text-xs text-slate-500">Klik kartu untuk mengedit langsung</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          
          {/* Projects Summary */}
          <Link 
            to="/projects"
            className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-400 transition-all group block"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Portofolio Proyek</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 group-hover:text-blue-600 transition-colors">
                  {projects.length} Proyek
                </h3>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FiBriefcase size={20} />
              </div>
            </div>
            <div className="mt-3.5 pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
              <div className="flex justify-between">
                <span>Residensial & Villa:</span>
                <span className="font-bold text-slate-700">{residentialCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Komersial & Gedung:</span>
                <span className="font-bold text-slate-700">{commercialCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Infrastruktur & Baja:</span>
                <span className="font-bold text-slate-700">{infraCount}</span>
              </div>
            </div>
          </Link>

          {/* Services Summary */}
          <Link 
            to="/services"
            className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-indigo-400 transition-all group block"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bidang Layanan</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 group-hover:text-indigo-600 transition-colors">
                  {services.length} Bidang
                </h3>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FiTool size={20} />
              </div>
            </div>
            <div className="mt-3.5 pt-3 border-t border-slate-100 text-xs text-slate-500">
              <p className="line-clamp-2">
                {services.map((s: any) => s.title).join(', ') || 'Belum ada layanan ditambahkan.'}
              </p>
            </div>
          </Link>

          {/* Clients Summary */}
          <Link 
            to="/clients"
            className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all group block"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Klien & Mitra</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 group-hover:text-emerald-600 transition-colors">
                  {clients.length} Rekanan
                </h3>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FiUsers size={20} />
              </div>
            </div>
            <div className="mt-3.5 pt-3 border-t border-slate-100 text-xs text-slate-500">
              <p className="line-clamp-2">
                {clients.map((c: any) => c.name).join(', ') || 'Belum ada mitra ditambahkan.'}
              </p>
            </div>
          </Link>

          {/* Reasons (Why Us) */}
          <Link 
            to="/reasons"
            className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-amber-400 transition-all group block"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Keunggulan Kami</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 group-hover:text-amber-600 transition-colors">
                  {reasons.length} Keunggulan
                </h3>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FiAward size={20} />
              </div>
            </div>
            <div className="mt-3.5 pt-3 border-t border-slate-100 text-xs text-slate-500">
              <p className="line-clamp-2">
                {reasons.map((r: any) => r.title).join(', ') || 'Belum ada poin keunggulan.'}
              </p>
            </div>
          </Link>

        </div>
      </div>

      {/* 4. DETAIL MONITORING PENGATURAN & BANNER MEDIA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Status Banner Media & Banner Kontak */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FiVideo className="text-blue-600" />
              <span>Monitoring Media & Banner Website</span>
            </h3>
            <Link to="/settings" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
              Ubah Pengaturan →
            </Link>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            {/* Banner Kontak */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  {settings.contactBgType === 'video' ? <FiVideo className="text-blue-600" /> : <FiImage className="text-emerald-600" />}
                  Latar Belakang Banner Kontak
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  settings.contactBgType === 'video' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  Tipe: {settings.contactBgType === 'video' ? 'Video' : 'Gambar'}
                </span>
              </div>
              <p className="text-slate-500 text-xs truncate">
                {settings.contactBgType === 'video'
                  ? (settings.contactVideo || 'Link video default')
                  : (settings.contactImage ? 'Gambar khusus terpasang' : 'Gambar konstruksi default')}
              </p>
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-200/50">
                <span>Kegelapan Overlay:</span>
                <span className="font-bold text-slate-700">{settings.contactOverlayOpacity || 35}% (Jelas & Terang)</span>
              </div>
            </div>

            {/* Video Profil Tentang Kami */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <FiVideo className="text-indigo-600" />
                  Video Profil Tentang Kami
                </span>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                  {settings.aboutVideo ? 'Kustom' : 'Default'}
                </span>
              </div>
              <p className="text-slate-500 text-xs truncate">
                {settings.aboutVideo || '/construction-video.mp4'}
              </p>
            </div>

            {/* Hero Slider */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 flex items-center justify-between">
              <span className="font-bold text-slate-800">Slider Hero Banner Depan</span>
              <span className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded-xl">
                3 Slide Aktif
              </span>
            </div>
          </div>
        </div>

        {/* Monitoring Saluran Kontak & Keamanan */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FiPhone className="text-emerald-600" />
              <span>Monitoring Saluran Kontak & Sosmed</span>
            </h3>
            <Link to="/settings" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
              Edit Kontak →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            {/* WhatsApp */}
            <div className="p-3 bg-emerald-50/70 border border-emerald-200/70 rounded-2xl">
              <div className="flex items-center gap-2 text-emerald-800 font-bold mb-1">
                <FaWhatsapp size={16} /> WhatsApp Resmi
              </div>
              <p className="font-mono text-slate-700 text-xs truncate">
                +{settings.whatsappNumber || '6281234567890'}
              </p>
            </div>

            {/* Email */}
            <div className="p-3 bg-blue-50/70 border border-blue-200/70 rounded-2xl">
              <div className="flex items-center gap-2 text-blue-800 font-bold mb-1">
                <FiMail size={16} /> Email Operasional
              </div>
              <p className="font-mono text-slate-700 text-xs truncate">
                {settings.emailAddress || 'contact@rayakonstruksi.com'}
              </p>
            </div>

            {/* TikTok */}
            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-2xl">
              <div className="flex items-center gap-2 text-neutral-900 font-bold mb-1">
                <FaTiktok size={14} /> TikTok
              </div>
              <p className="text-slate-600 text-xs truncate">
                @{settings.tiktok || 'rayakonstruksijaya'}
              </p>
            </div>

            {/* Instagram */}
            <div className="p-3 bg-pink-50/70 border border-pink-200/70 rounded-2xl">
              <div className="flex items-center gap-2 text-pink-700 font-bold mb-1">
                <FaInstagram size={16} /> Instagram
              </div>
              <p className="text-slate-600 text-xs truncate">
                @{settings.instagram || 'rayakonstruksijaya'}
              </p>
            </div>
          </div>

          {/* Superadmin & Keamanan Hak Akses Info */}
          <div className="p-3.5 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                <FiShield size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Superadmin Utama:</p>
                <p className="text-[11px] text-slate-400 font-mono">fikihrz3135@gmail.com</p>
              </div>
            </div>
            {isSuperAdmin && (
              <Link
                to="/users"
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-all"
              >
                Kelola Akses
              </Link>
            )}
          </div>
        </div>

      </div>

      {/* 5. LIVE ACTIVITY FEED: ULASAN MASUK TERBARU & PROYEK TERAKHIR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Ulasan Klien Masuk Terbaru */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FiStar className="text-amber-500" />
              <span>Ulasan Masuk Terbaru ({reviews.length})</span>
            </h3>
            <Link to="/reviews" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
              Lihat Semua →
            </Link>
          </div>

          {reviews.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">Belum ada ulasan klien yang masuk.</p>
          ) : (
            <div className="space-y-3">
              {reviews.slice(0, 3).map((r: any, idx: number) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs">{r.name}</span>
                    <div className="flex text-amber-400 text-xs">
                      {Array.from({ length: Number(r.rating) || 5 }).map((_, i) => (
                        <FiStar key={i} fill="currentColor" size={11} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">"{r.review}"</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>{r.company || 'Klien'}</span>
                    <span>{r.date || 'Baru'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Portofolio Proyek Terkini */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FiBriefcase className="text-blue-600" />
              <span>Portofolio Proyek Terkini ({projects.length})</span>
            </h3>
            <Link to="/projects" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
              Kelola Proyek →
            </Link>
          </div>

          {projects.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">Belum ada proyek yang ditambahkan.</p>
          ) : (
            <div className="space-y-3">
              {projects.slice(0, 3).map((p: any, idx: number) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="font-bold text-slate-800 text-xs block truncate">{p.title}</span>
                    <span className="text-[11px] text-blue-600 font-semibold">{p.category || 'Konstruksi'}</span>
                    <span className="text-[11px] text-slate-400 block truncate">{p.location || 'Surakarta'}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded-xl border border-slate-200 flex-shrink-0">
                    {p.year || '2026'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
