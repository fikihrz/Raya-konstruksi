import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white py-16 border-t border-slate-900">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16">
          
          {/* Logo & Slogan Column */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full overflow-hidden bg-white flex items-center justify-center border border-white/10 p-0.5 shadow-sm">
                <img 
                  src="/galery/WhatsApp Image 2026-07-01 at 23.38.34.jpeg" 
                  alt="Raya Group Logo" 
                  className="h-full w-full object-cover rounded-full"
                />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-wider uppercase leading-none">Raya Konstruksi</h3>
                <span className="text-[10px] text-primary-container font-semibold tracking-[0.2em] uppercase">Building Excellence</span>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm">
              Membangun impian Anda dengan fondasi yang kuat, presisi teknik sipil tingkat tinggi, dan kualitas tanpa kompromi.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 space-y-5">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/80">Navigation</h4>
            <ul className="space-y-3 text-sm text-white/55">
              <li><a href="#about" className="hover:text-primary-container transition-colors">Tentang Kami</a></li>
              <li><a href="#services" className="hover:text-primary-container transition-colors">Layanan & Keahlian</a></li>
              <li><a href="#projects" className="hover:text-primary-container transition-colors">Masterpieces / Portfolio</a></li>
              <li><a href="#contact" className="hover:text-primary-container transition-colors">Hubungi Kami</a></li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="md:col-span-4 space-y-5">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/80">Head Office</h4>
            <ul className="space-y-3 text-sm text-white/55">
              <li className="flex items-start gap-3">
                <FiMapPin className="text-primary-container mt-0.5 flex-shrink-0" />
                <span>Jl. Pembangunan Raya No. 123, Skyline District, Jakarta</span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-primary-container flex-shrink-0" />
                <span>+62 21 5550 8888</span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-primary-container flex-shrink-0" />
                <span>contact@rayakonstruksi.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright Row */}
        <div className="border-t border-white/[0.08] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <span>&copy; {new Date().getFullYear()} Raya Konstruksi. All rights reserved.</span>
          <span className="uppercase tracking-widest text-[9px]">Jakarta, Indonesia</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
