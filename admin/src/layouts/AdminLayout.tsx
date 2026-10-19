import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiHome, 
  FiBriefcase, 
  FiTool, 
  FiSettings, 
  FiLogOut, 
  FiBox, 
  FiStar, 
  FiUsers, 
  FiMessageSquare,
  FiMenu,
  FiX
} from 'react-icons/fi';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);

  // 1. Strict Authentication Check
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    try {
      const storedUser = localStorage.getItem('admin_user');
      if (storedUser) {
        setAdminUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error(e);
    }
  }, [location, navigate]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [path]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_auth');
    navigate('/login', { replace: true });
  };

  const menu = [
    { name: 'Dashboard', path: '/', icon: <FiHome size={19} /> },
    { name: 'Projects', path: '/projects', icon: <FiBriefcase size={19} /> },
    { name: 'Services', path: '/services', icon: <FiTool size={19} /> },
    { name: 'Kenapa Kami', path: '/reasons', icon: <FiStar size={19} /> },
    { name: 'Klien & Mitra', path: '/clients', icon: <FiUsers size={19} /> },
    { name: 'Ulasan Klien', path: '/reviews', icon: <FiMessageSquare size={19} /> },
    { name: 'Pengaturan Web', path: '/settings', icon: <FiSettings size={19} /> },
  ];

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar: Desktop Static & Mobile Slide-Over Drawer */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out
        md:static md:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl overflow-hidden flex items-center justify-center p-1 shadow-lg shadow-blue-900/50 flex-shrink-0">
              <img src="/Profil.png" alt="Raya Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight leading-none">Raya<span className="text-blue-500">.</span></h2>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-1">Admin Workspace</p>
            </div>
          </div>
          {/* Close button for mobile */}
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <FiX size={20} />
          </button>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menu.map((item) => {
            const isActive = path === item.path;
            return (
              <Link 
                key={item.name} 
                to={item.path} 
                className={`flex items-center space-x-3 px-3.5 py-3 rounded-xl transition-all duration-200 text-sm font-semibold ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 translate-x-1' 
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        {/* Bottom User Profile & Logout */}
        <div className="p-4 border-t border-slate-800/80 mt-auto bg-slate-950/40">
          <div className="bg-slate-800/60 rounded-xl p-3.5 mb-3 border border-slate-700/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 border border-blue-400/30 flex items-center justify-center font-bold text-xs text-white flex-shrink-0">
              {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{adminUser?.name || 'Administrator'}</p>
              <p className="text-[11px] text-slate-400 truncate">{adminUser?.email || 'admin@rayakonstruksi.com'}</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center space-x-2 py-2.5 w-full rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-xs font-bold border border-red-500/20"
          >
            <FiLogOut size={16} /> <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200/80 py-3.5 px-4 sm:px-6 lg:px-8 flex justify-between items-center z-10 sticky top-0 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Hamburger Button for Mobile */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              aria-label="Buka Menu"
            >
              <FiMenu size={20} />
            </button>

            {/* Breadcrumb Title */}
            <div className="flex items-center gap-2 text-slate-500 text-xs sm:text-sm font-medium">
              <span className="hidden sm:inline text-slate-400">Raya Workspace</span>
              <span className="hidden sm:inline text-slate-300">/</span>
              <span className="text-slate-900 font-bold capitalize">
                {menu.find(m => m.path === path)?.name || (path === '/' ? 'Dashboard' : path.replace('/', ''))}
              </span>
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3">
            <Link
              to="/settings"
              className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors"
              title="Pengaturan"
            >
              <FiSettings size={18} />
            </Link>
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition-colors"
              title="Keluar"
            >
              <FiLogOut size={14} /> <span>Keluar</span>
            </button>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-100/70">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>

    </div>
  );
};

export default AdminLayout;
