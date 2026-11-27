import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiHome, 
  FiBriefcase, 
  FiTool, 
  FiSettings, 
  FiLogOut, 
  FiStar, 
  FiUsers, 
  FiMessageSquare,
  FiMenu,
  FiX,
  FiShield,
  FiChevronLeft,
  FiChevronRight,
  FiExternalLink,
  FiGlobe
} from 'react-icons/fi';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  
  // Mobile drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Desktop collapsible rail state (persisted)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('admin_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

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

  const toggleDesktopSidebar = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('admin_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_auth');
    navigate('/login', { replace: true });
  };

  const isSuperAdmin = adminUser?.role === 'superadmin' || adminUser?.email?.toLowerCase().trim() === 'fikihrz3135@gmail.com';

  const menu = [
    { name: 'Dashboard', path: '/', icon: <FiHome size={19} /> },
    { name: 'Projects', path: '/projects', icon: <FiBriefcase size={19} /> },
    { name: 'Services', path: '/services', icon: <FiTool size={19} /> },
    { name: 'Kenapa Kami', path: '/reasons', icon: <FiStar size={19} /> },
    { name: 'Klien & Mitra', path: '/clients', icon: <FiUsers size={19} /> },
    { name: 'Ulasan Klien', path: '/reviews', icon: <FiMessageSquare size={19} /> },
    { name: 'Pengaturan Web', path: '/settings', icon: <FiSettings size={19} /> },
    ...(isSuperAdmin ? [{ name: 'Kelola Admin', path: '/users', icon: <FiShield size={19} /> }] : []),
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

      {/* Sidebar: Desktop Sliding/Collapsible & Mobile Slide-Over Drawer */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 ease-in-out select-none
        md:static md:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'}
        ${isCollapsed ? 'md:w-20' : 'md:w-72'}
      `}>
        
        {/* Brand Header */}
        <div className={`p-4 sm:p-5 flex items-center border-b border-slate-800/80 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/" className="w-10 h-10 bg-blue-600 rounded-xl overflow-hidden flex items-center justify-center p-1 shadow-lg shadow-blue-900/50 flex-shrink-0 hover:scale-105 transition-transform">
              <img src="/Profil.png" alt="Raya Logo" className="w-full h-full object-contain" />
            </Link>
            
            {!isCollapsed && (
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-white tracking-tight leading-none truncate">
                  Raya<span className="text-blue-500">.</span>
                </h2>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-1">Admin Workspace</p>
              </div>
            )}
          </div>

          {/* Desktop Toggle Button (Collapse/Expand) */}
          <button
            type="button"
            onClick={toggleDesktopSidebar}
            className={`hidden md:flex items-center justify-center p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer ${isCollapsed ? 'mt-3' : ''}`}
            title={isCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
          >
            {isCollapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
          </button>

          {/* Mobile Close Button */}
          <button 
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg"
            aria-label="Tutup Menu"
          >
            <FiX size={20} />
          </button>
        </div>
        
        {/* Section Header (Expanded Only) */}
        {!isCollapsed && (
          <div className="px-6 pt-4 pb-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Menu Utama
            </span>
          </div>
        )}

        {/* Navigation Menu List */}
        <nav className="flex-1 px-3 py-3 space-y-1.5 overflow-y-auto">
          {menu.map((item) => {
            const isActive = path === item.path;
            return (
              <Link 
                key={item.name} 
                to={item.path} 
                title={isCollapsed ? item.name : undefined}
                className={`flex items-center rounded-xl transition-all duration-200 font-semibold group relative ${
                  isCollapsed ? 'justify-center p-3 text-slate-400' : 'space-x-3 px-3.5 py-3 text-sm'
                } ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' 
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <span className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                  {item.icon}
                </span>

                {!isCollapsed && (
                  <span className="truncate">{item.name}</span>
                )}

                {/* Floating Tooltip when Collapsed */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-950 text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 border border-slate-700">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Live Website Status Pill (Expanded Only) */}
        {!isCollapsed && (
          <div className="mx-3.5 my-2 p-3 bg-gradient-to-br from-blue-950/60 to-slate-800/80 border border-blue-500/30 rounded-2xl">
            <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Web Live Online
              </span>
              <span className="text-[10px] text-blue-300 font-mono">200 OK</span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mb-2">rayakonstruksijaya.com</p>
            <a
              href="https://www.rayakonstruksijaya.com"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:scale-[1.02]"
            >
              <FiExternalLink size={13} />
              <span>Kunjungi Website</span>
            </a>
          </div>
        )}

        {/* Collapsed Website Shortcut */}
        {isCollapsed && (
          <div className="p-3 border-t border-slate-800/80 flex justify-center">
            <a
              href="https://www.rayakonstruksijaya.com"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative group"
              title="Buka Website Langsung"
            >
              <FiGlobe size={18} className="text-emerald-400" />
              <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-950 text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 border border-slate-700">
                Buka Website Langsung
              </div>
            </a>
          </div>
        )}
        
        {/* Bottom User Profile & Logout */}
        <div className={`border-t border-slate-800/80 mt-auto bg-slate-950/40 ${isCollapsed ? 'p-3 flex flex-col items-center gap-2' : 'p-4'}`}>
          {!isCollapsed ? (
            <>
              <div className="bg-slate-800/60 rounded-xl p-3 mb-2.5 border border-slate-700/60 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full border flex items-center justify-center font-bold text-xs text-white flex-shrink-0 ${
                  isSuperAdmin 
                    ? 'bg-gradient-to-tr from-amber-500 to-yellow-600 border-amber-400/40 shadow-md shadow-amber-900/40' 
                    : 'bg-gradient-to-tr from-blue-500 to-indigo-600 border-blue-400/30'
                }`}>
                  {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-white truncate">{adminUser?.name || 'Administrator'}</p>
                    {isSuperAdmin ? (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        Super
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{adminUser?.email || 'admin@rayakonstruksi.com'}</p>
                </div>
              </div>
              
              <button 
                onClick={handleLogout}
                className="flex items-center justify-center space-x-2 py-2.5 w-full rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-xs font-bold border border-red-500/20 cursor-pointer"
              >
                <FiLogOut size={16} /> <span>Keluar (Logout)</span>
              </button>
            </>
          ) : (
            <>
              <div 
                className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-xs text-white relative group cursor-pointer ${
                  isSuperAdmin 
                    ? 'bg-gradient-to-tr from-amber-500 to-yellow-600 border-amber-400/40' 
                    : 'bg-gradient-to-tr from-blue-500 to-indigo-600 border-blue-400/30'
                }`}
                title={adminUser?.name || 'Admin'}
              >
                {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-950 text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 border border-slate-700">
                  {adminUser?.name} ({isSuperAdmin ? 'Superadmin' : 'Admin'})
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="p-2.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer relative group"
                title="Keluar (Logout)"
              >
                <FiLogOut size={18} />
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-950 text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 border border-slate-700">
                  Keluar (Logout)
                </div>
              </button>
            </>
          )}
        </div>
      </aside>
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200/80 py-3.5 px-4 sm:px-6 lg:px-8 flex justify-between items-center z-10 sticky top-0 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Hamburger / Toggle Button (Works on both Mobile & Desktop) */}
            <button
              type="button"
              onClick={() => {
                if (window.innerWidth < 768) {
                  setMobileMenuOpen(prev => !prev);
                } else {
                  toggleDesktopSidebar();
                }
              }}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              aria-label="Toggle Sidebar"
              title="Buka / Tutup Sidebar"
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
          <div className="flex items-center space-x-2.5">
            <a
              href="https://www.rayakonstruksijaya.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition-colors"
              title="Buka Website Utama"
            >
              <FiExternalLink size={14} />
              <span className="hidden sm:inline">Lihat Web</span>
            </a>

            <Link
              to="/settings"
              className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors"
              title="Pengaturan"
            >
              <FiSettings size={18} />
            </Link>
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition-colors cursor-pointer"
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
