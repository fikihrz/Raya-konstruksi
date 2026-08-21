import { FiBriefcase, FiTool, FiMessageSquare, FiMail, FiTrendingUp } from 'react-icons/fi';

const Dashboard = () => {

  const stats = [
    { title: 'Total Projects', count: '150+', icon: <FiBriefcase size={24} />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Layanan Aktif', count: '8', icon: <FiTool size={24} />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Ulasan Klien', count: '45', icon: <FiMessageSquare size={24} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Inquiries', count: '12', icon: <FiMail size={24} />, color: 'text-amber-600', bg: 'bg-amber-50' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Company Overview</h2>
          <p className="text-slate-500 text-sm mt-1">Here's what's happening with your business today.</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
          <FiTrendingUp /> Download Report
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.title}</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">{stat.count}</h3>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a href="/projects" className="block p-4 rounded-lg border border-slate-100 hover:border-blue-500 hover:shadow-md transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform"><FiBriefcase /></div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Tambah Project Baru</h4>
                    <p className="text-sm text-slate-500">Update portofolio terbaru ke website</p>
                  </div>
                </div>
              </div>
            </a>
            <a href="/services" className="block p-4 rounded-lg border border-slate-100 hover:border-indigo-500 hover:shadow-md transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform"><FiTool /></div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Kelola Layanan</h4>
                    <p className="text-sm text-slate-500">Edit detail layanan yang ditawarkan</p>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Informasi Web</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-slate-500">Status Website</span>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-bold">Online</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-slate-500">Total Pengunjung (Bulan ini)</span>
              <span className="font-bold text-slate-800">1,245</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-slate-500">Pembaruan Terakhir</span>
              <span className="font-bold text-slate-800">Hari ini, 14:30</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
