import { Outlet, Link, useLocation } from 'react-router-dom';
import { FiHome, FiBriefcase, FiTool, FiSettings, FiLogOut, FiBox, FiStar, FiUsers } from 'react-icons/fi';

const AdminLayout = () => {
  const location = useLocation();
  const path = location.pathname;

  const menu = [
    { name: 'Dashboard', path: '/', icon: <FiHome size={20} /> },
    { name: 'Projects', path: '/projects', icon: <FiBriefcase size={20} /> },
    { name: 'Services', path: '/services', icon: <FiTool size={20} /> },
    { name: 'Kenapa Kami', path: '/reasons', icon: <FiStar size={20} /> },
    { name: 'Klien & Mitra', path: '/clients', icon: <FiUsers size={20} /> },
    { name: 'Pengaturan Web', path: '/settings', icon: <FiSettings size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 pb-2 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-900/50">
            <FiBox size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Raya<span className="text-blue-500">.</span></h2>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Admin Workspace</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 mt-8 space-y-1">
          {menu.map((item) => (
            <Link 
              key={item.name} 
              to={item.path} 
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${path === item.path ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              {item.icon} <span className="font-medium text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>
        
        <div className="p-4 mt-auto">
          <div className="bg-slate-800/50 rounded-xl p-4 mb-4 border border-slate-700">
            <p className="text-xs text-slate-400 mb-2">Logged in as</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border-2 border-slate-700"></div>
              <span className="text-sm font-medium text-white">Super Admin</span>
            </div>
          </div>
          <button 
            onClick={() => {
              localStorage.removeItem('admin_auth');
              window.location.href = '/login';
            }}
            className="flex items-center justify-center space-x-2 p-2.5 w-full rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm font-medium"
          >
            <FiLogOut /> <span>Logout</span>
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 py-4 px-8 flex justify-between items-center z-10 sticky top-0">
          <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
            <FiHome /> <span>/</span> <span className="text-slate-800 capitalize">{path === '/' ? 'Dashboard' : path.replace('/', '')}</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
              <FiSettings size={18} />
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8 bg-slate-50">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
