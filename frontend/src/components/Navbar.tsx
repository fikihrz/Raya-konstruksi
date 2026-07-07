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
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full overflow-hidden bg-transparent flex items-center justify-center">
            <img
              src="/galery/WhatsApp Image 2026-07-01 at 23.38.34.jpeg"
              alt="Raya Group Logo"
              className="h-full w-full object-cover rounded-full"
              style={{ mixBlendMode: 'multiply' }}
            />
          </div>
          <span className={`text-xl font-bold transition-colors ${isScrolled ? 'text-secondary' : 'text-white'}`}>
            Raya Konstruksi
          </span>
        </Link>
        <div className={`hidden md:flex space-x-6 font-semibold ${isScrolled ? 'text-secondary' : 'text-white'}`}>
          <a href="#home" className="hover:text-primary-container transition-colors">Home</a>
          <a href="#about" className="hover:text-primary-container transition-colors">Tentang Kami</a>
          <a href="#services" className="hover:text-primary-container transition-colors">Layanan</a>
          <a href="#projects" className="hover:text-primary-container transition-colors">Project</a>
          <a href="#contact" className="hover:text-primary-container transition-colors">Kontak</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
