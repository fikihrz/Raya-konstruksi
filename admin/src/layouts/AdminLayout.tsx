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
  FiSidebar,
  FiExternalLink
} from 'react-icons/fi';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('admin_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const [adminUser, setAdminUser] = useState<any>(null);

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
  const collapsedView = isCollapsed && !mobileMenuOpen;

  const menu = [
    { name: 'Dashboard', path: '/', icon: <FiHome size={18} /> },
    { name: 'Projects', path: '/projects', icon: <FiBriefcase size={18} /> },
    { name: 'Services', path: '/services', icon: <FiTool size={18} /> },
    { name: 'Kenapa Kami', path: '/reasons', icon: <FiStar size={18} /> },
    { name: 'Klien & Mitra', path: '/clients', icon: <FiUsers size={18} /> },
    { name: 'Ulasan Klien', path: '/reviews', icon: <FiMessageSquare size={18} /> },
    { name: 'Pengaturan Web', path: '/settings', icon: <FiSettings size={18} /> },
    ...(isSuperAdmin ? [{ name: 'Kelola Admin', path: '/users', icon: <FiShield size={18} /> }] : []),
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden text-slate-900">
      
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      {/* Clean Formal Light Sidebar (Inspired by Pointsale Reference) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out select-none
        md:static md:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full md:translate-x-0'}
        ${isCollapsed ? 'md:w-[72px]' : 'md:w-64'}
      `}>
        
        {/* Brand Header & Collapse Toggle */}
        <div className={`h-16 px-4 flex items-center border-b border-slate-100 flex-shrink-0 ${collapsedView ? 'justify-center' : 'justify-between'}`}>
          <Link to="/" className="flex items-center gap-2.5 min-w-0">
            <img
              src="/Profil.png"
              alt="Raya Logo"
              className="w-9 h-9 object-contain flex-shrink-0"
            />
            {!collapsedView && (
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-slate-900 tracking-tight leading-none truncate">
                  Raya Konstruksi<span className="text-blue-600">.</span>
                </h2>
                <p className="text-[11px] text-blue-600 font-semibold mt-0.5 truncate">Corporate CMS</p>
              </div>
            )}
          </Link>

          {!collapsedView && (
            <button
              type="button"
              onClick={toggleDesktopSidebar}
              className="hidden md:flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Ciutkan Sidebar"
            >
              <FiSidebar size={17} />
            </button>
          )}

          <button 
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-slate-400 hover:text-slate-700 p-1.5 rounded-lg cursor-pointer"
            aria-label="Tutup Menu"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Expand button when collapsed */}
        {collapsedView && (
          <div className="hidden md:flex justify-center py-2.5 border-b border-slate-100">
            <button
              type="button"
              onClick={toggleDesktopSidebar}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Perluas Sidebar"
            >
              <FiSidebar size={17} />
            </button>
          </div>
        )}
        
        {/* Section Label */}
        {!collapsedView && (
          <div className="px-4 pt-5 pb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Menu
            </span>
          </div>
        )}

        {/* Navigation List (No overflow-x-hidden issues, clean native tooltips) */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto overflow-x-hidden">
          {menu.map((item) => {
            const isActive = path === item.path;
            return (
              <Link 
                key={item.name} 
                to={item.path} 
                title={collapsedView ? item.name : undefined}
                className={`flex items-center rounded-xl transition-all duration-150 text-sm font-medium ${
                  collapsedView ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'
                } ${
                  isActive 
                    ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-600/25' 
                    : 'text-slate-600 hover:bg-blue-50/70 hover:text-blue-700'
                }`}
              >
                <span className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`}>
                  {item.icon}
                </span>
                {!collapsedView && (
                  <span className="truncate">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Website Status Card (Expanded Only) */}
        {!collapsedView && (
          <div className="mx-3 mb-3 p-3.5 bg-blue-50/70 border border-blue-200/70 rounded-xl">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Website Live
              </span>
              <span className="text-[10px] text-blue-600 font-mono font-semibold">Production</span>
            </div>
            <p className="text-[11px] text-slate-500 truncate mb-2.5">rayakonstruksijaya.com</p>
            <a
              href="https://www.rayakonstruksijaya.com"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
            >
              <FiExternalLink size={12} />
              <span>Buka Website</span>
            </a>
          </div>
        )}
        
        {/* Bottom User Profile & Logout */}
        <div className={`border-t border-slate-200/80 mt-auto ${collapsedView ? 'p-2.5 flex flex-col items-center gap-2' : 'p-3'}`}>
          {!collapsedView ? (
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white flex-shrink-0 ${
                  isSuperAdmin ? 'bg-slate-900' : 'bg-blue-600'
                }`}>
                  {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-semibold text-slate-800 truncate">{adminUser?.name || 'Administrator'}</p>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                      isSuperAdmin 
                        ? 'bg-slate-200 text-slate-700' 
                        : 'bg-blue-50 text-blue-700'
                    }`}>
                      {isSuperAdmin ? 'Super' : 'Admin'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{adminUser?.email || 'admin@rayakonstruksi.com'}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer flex-shrink-0"
                title="Keluar (Logout)"
              >
                <FiLogOut size={16} />
              </button>
            </div>
          ) : (
            <>
              <div 
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white ${
                  isSuperAdmin ? 'bg-slate-900' : 'bg-blue-600'
                }`}
                title={`${adminUser?.name || 'Admin'} (${isSuperAdmin ? 'Superadmin' : 'Admin'})`}
              >
                {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                title="Keluar (Logout)"
              >
                <FiLogOut size={17} />
              </button>
            </>
          )}
        </div>
      </aside>
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex justify-between items-center z-10 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="md:hidden p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              <FiMenu size={18} />
            </button>

            {/* Breadcrumb Title */}
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="hidden sm:inline text-slate-400 font-medium">PT Raya Konstruksi Jaya</span>
              <span className="hidden sm:inline text-slate-300">/</span>
              <span className="text-slate-900 font-semibold">
                {menu.find(m => m.path === path)?.name || (path === '/' ? 'Dashboard' : path.replace('/', ''))}
              </span>
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            <a
              href="https://www.rayakonstruksijaya.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
            >
              <FiExternalLink size={13} />
              <span className="hidden sm:inline">Lihat Web</span>
            </a>

            <Link
              to="/settings"
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
              title="Pengaturan"
            >
              <FiSettings size={16} />
            </Link>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>

    </div>
  );
};

export default AdminLayout;
