import { Outlet, Link } from 'react-router-dom';
import { FiHome, FiBriefcase, FiUsers, FiSettings, FiLogOut } from 'react-icons/fi';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-orange-500">Raya Admin</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link to="/" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
            <FiHome /> <span>Dashboard</span>
          </Link>
          <Link to="/projects" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
            <FiBriefcase /> <span>Projects</span>
          </Link>
          <Link to="/services" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
            <FiSettings /> <span>Layanan</span>
          </Link>
          <Link to="/users" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
            <FiUsers /> <span>User Admin</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button className="flex items-center space-x-3 p-3 w-full rounded-lg hover:bg-red-600 transition-colors text-left">
            <FiLogOut /> <span>Logout</span>
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Dashboard Panel</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-600">Admin User</span>
            <div className="w-8 h-8 rounded-full bg-orange-500"></div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
