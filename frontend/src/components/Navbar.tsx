import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-900/90 backdrop-blur-md shadow-lg py-3.5 border-b border-slate-800' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full overflow-hidden bg-transparent flex items-center justify-center">
            <img
              src="/galery/WhatsApp Image 2026-07-01 at 23.38.34.jpeg"
              alt="Raya Group Logo"
              className="h-full w-full object-cover rounded-full"
            />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            Raya Konstruksi
          </span>
        </Link>
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-200">
          <a href="#home" className="hover:text-blue-400 transition-colors">Home</a>
          <a href="#about" className="hover:text-blue-400 transition-colors">Tentang Kami</a>
          <a href="#services" className="hover:text-blue-400 transition-colors">Layanan</a>
          <a href="#projects" className="hover:text-blue-400 transition-colors">Project</a>
          <a href="#contact" className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md">Kontak</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
