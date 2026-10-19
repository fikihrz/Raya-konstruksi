import { useState, useEffect } from 'react';
import { FiBriefcase, FiTool, FiUsers, FiAward, FiCheckCircle, FiActivity } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const API = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://backend-three-beta-90.vercel.app';

const Dashboard = () => {
  const [data, setData] = useState<any>({
    projects: [],
    services: [],
    clients: [],
    reasons: [],
    settings: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/data`)
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const stats = [
    { 
      title: 'Total Projects', 
      count: data.projects?.length || 0, 
      icon: <FiBriefcase size={24} />, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      link: '/projects'
    },
    { 
      title: 'Layanan Aktif', 
      count: data.services?.length || 0, 
      icon: <FiTool size={24} />, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50',
      link: '/services'
    },
    { 
      title: 'Klien & Mitra', 
      count: data.clients?.length || 0, 
      icon: <FiUsers size={24} />, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50',
      link: '/clients'
    },
    { 
      title: 'Keunggulan Kami', 
      count: data.reasons?.length || 0, 
      icon: <FiAward size={24} />, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50',
      link: '/reasons'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Company Overview</h2>
          <p className="text-slate-500 text-sm mt-1">Status dan ringkasan data Content Management System PT Raya Konstruksi Jaya.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold">
          <FiActivity className="animate-pulse" /> Database Atlas Connected
        </div>
      </div>
      
      {/* Live Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Link 
            key={i} 
            to={stat.link}
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md hover:border-blue-200 transition-all"
          >
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.title}</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">
                {loading ? '...' : stat.count}
              </h3>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Aksi Cepat</h3>
          <div className="space-y-3">
            <Link to="/projects" className="block p-4 rounded-lg border border-slate-100 hover:border-blue-500 hover:shadow-md transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform"><FiBriefcase /></div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Manajemen Project</h4>
                    <p className="text-sm text-slate-500">Tambah, ubah foto, dan hapus portofolio proyek</p>
                  </div>
                </div>
              </div>
            </Link>
            <Link to="/services" className="block p-4 rounded-lg border border-slate-100 hover:border-indigo-500 hover:shadow-md transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform"><FiTool /></div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Kelola Layanan</h4>
                    <p className="text-sm text-slate-500">Ubah daftar bidang keahlian dan jasa konstruksi</p>
                  </div>
                </div>
              </div>
            </Link>
            <Link to="/settings" className="block p-4 rounded-lg border border-slate-100 hover:border-amber-500 hover:shadow-md transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform"><FiCheckCircle /></div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Pengaturan Teks & Kontak</h4>
                    <p className="text-sm text-slate-500">Edit nomor WhatsApp, alamat kantor, email, dan moto perusahaan</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Informasi Sistem */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Informasi Sistem Website</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-slate-500 text-sm">Status Website</span>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Live Online
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-slate-500 text-sm">Penyimpanan Database</span>
                <span className="font-semibold text-slate-700 text-sm">MongoDB Atlas Cloud</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-slate-500 text-sm">Hosting & CDN</span>
                <span className="font-semibold text-slate-700 text-sm">Vercel Production Edge</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-slate-500 text-sm">Domain Frontend</span>
                <a href="https://rayakonstruksi.vercel.app" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm font-medium">
                  rayakonstruksi.vercel.app ↗
                </a>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Versi CMS: v2.4 Enterprise</span>
            <span className="text-slate-400">© 2026 PT Raya Konstruksi Jaya</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
