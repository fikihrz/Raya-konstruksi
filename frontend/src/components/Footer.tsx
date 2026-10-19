import { useState, useEffect } from 'react';
import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';
import { FaInstagram, FaTelegramPlane } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const API = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://backend-three-beta-90.vercel.app';

const Footer = () => {
  const { t, lang } = useLanguage();
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    fetch(`${API}/api/data`)
      .then(res => res.json())
      .then(data => {
        if (data && data.settings) {
          setSettings(data.settings);
        }
      })
      .catch(err => console.error('Failed to load footer settings:', err));
  }, []);

  const getInstagramUrl = () => {
    if (!settings.instagram) return 'https://instagram.com/rayakonstruksi';
    if (settings.instagram.startsWith('http')) return settings.instagram;
    const cleanHandle = settings.instagram.replace(/^@/, '');
    return `https://instagram.com/${cleanHandle}`;
  };

  const getInstagramHandle = () => {
    if (!settings.instagram) return '@rayakonstruksi';
    if (settings.instagram.startsWith('http')) {
      const parts = settings.instagram.split('/').filter(Boolean);
      return '@' + parts[parts.length - 1];
    }
    return settings.instagram.startsWith('@') ? settings.instagram : `@${settings.instagram}`;
  };

  return (
    <footer className="bg-slate-950 text-white pt-16 pb-12 border-t border-slate-900">
      <div className="container mx-auto px-6 max-w-7xl space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Column 1: Logo & Slogan (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-10 sm:h-12 w-auto flex items-center justify-center flex-shrink-0">
                <img 
                  src="/Profil.png" 
                  alt="Raya Konstruksi Jaya Logo" 
                  className="h-full w-auto max-w-[120px] object-contain"
                />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-wider uppercase leading-none">
                  {settings.companyName || 'Raya Konstruksi Jaya'}
                </h3>
                <span className="text-[10px] text-blue-400 font-bold tracking-[0.2em] uppercase">{t('footer.brandTagline')}</span>
              </div>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              {t('footer.companyDesc')}
            </p>
            <div className="pt-2 flex items-center gap-2.5">
              <a
                href={`https://wa.me/${(settings.whatsappNumber || '6281234567890').replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="h-9 w-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400 flex items-center justify-center transition-all shadow-sm"
                title="WhatsApp Resmi"
              >
                <FiPhone size={15} />
              </a>
              <a
                href={getInstagramUrl()}
                target="_blank"
                rel="noreferrer"
                className="h-9 w-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-pink-500/50 hover:bg-pink-500/10 text-slate-400 hover:text-pink-400 flex items-center justify-center transition-all shadow-sm"
                title="Instagram Resmi"
              >
                <FaInstagram size={15} />
              </a>
              <a
                href="https://t.me/rayakonstruksijaya"
                target="_blank"
                rel="noreferrer"
                className="h-9 w-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500/50 hover:bg-sky-500/10 text-slate-400 hover:text-sky-400 flex items-center justify-center transition-all shadow-sm"
                title="Telegram Resmi"
              >
                <FaTelegramPlane size={14} />
              </a>
              <a
                href={`mailto:${settings.emailAddress || 'contact@rayakonstruksi.com'}`}
                className="h-9 w-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-blue-500/10 text-slate-400 hover:text-blue-400 flex items-center justify-center transition-all shadow-sm"
                title="Email Resmi"
              >
                <FiMail size={15} />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400 font-medium">
              <li><a href="#about" className="hover:text-blue-400 transition-colors">{t('nav.about')}</a></li>
              <li><a href="#services" className="hover:text-blue-400 transition-colors">{t('nav.services')}</a></li>
              <li><a href="#projects" className="hover:text-blue-400 transition-colors">{t('nav.projects')}</a></li>
              <li><a href="#contact" className="hover:text-blue-400 transition-colors">{t('nav.contact')}</a></li>
            </ul>
          </div>

          {/* Column 3: Contact & Operational Details (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white">{t('footer.ourOffice')}</h4>
            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <FiMapPin className="text-blue-400 mt-1 flex-shrink-0" size={16} />
                <span className="leading-relaxed">{settings.companyAddress || 'Surakarta, Jawa Tengah, Indonesia'}</span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-blue-400 flex-shrink-0" size={16} />
                <a href={`https://wa.me/${(settings.whatsappNumber || '6281234567890').replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">
                  +{settings.whatsappNumber || '6281234567890'}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-blue-400 flex-shrink-0" size={16} />
                <a href={`mailto:${settings.emailAddress || 'contact@rayakonstruksi.com'}`} className="hover:text-blue-400 transition-colors truncate">
                  {settings.emailAddress || 'contact@rayakonstruksi.com'}
                </a>
              </li>
              <li className="flex items-center gap-3 pt-1 border-t border-slate-900 text-slate-400 text-xs">
                <FiClock className="text-blue-400 flex-shrink-0" size={15} />
                <span>{lang === 'EN' ? 'Mon - Sat: 08:00 - 17:00 WIB' : 'Senin - Sabtu: 08:00 - 17:00 WIB'}</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Interactive Google Maps Embed (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white">{t('footer.mapTitle')}</h4>
            <div className="w-full h-44 rounded-xl overflow-hidden border border-slate-800 shadow-lg relative bg-slate-900 group">
              <iframe
                title="Office Location Map"
                src="https://maps.google.com/maps?q=Surakarta,+Jawa+Tengah,+Indonesia&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0 filter contrast-[1.05] opacity-90 group-hover:opacity-100 transition-opacity"
                loading="lazy"
              ></iframe>
              <a
                href="https://maps.google.com/?q=Surakarta,+Indonesia"
                target="_blank"
                rel="noreferrer"
                className="absolute bottom-2 right-2 bg-slate-950/90 hover:bg-blue-600 text-[10px] font-bold text-white px-2.5 py-1 rounded-md border border-slate-700 transition-colors shadow"
              >
                {t('footer.openMaps')}
              </a>
            </div>
          </div>

        </div>

        {/* Copyright Row */}
        <div className="border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <span>&copy; {new Date().getFullYear()} {settings.companyName || 'Raya Konstruksi Jaya'}. {t('footer.rights')}</span>
          <span className="uppercase tracking-widest text-[10px] text-slate-400">{settings.companyAddress || 'Surakarta, Indonesia'}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
