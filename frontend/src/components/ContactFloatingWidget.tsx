import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX } from 'react-icons/fi';
import { FaWhatsapp, FaInstagram, FaTelegramPlane } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const API = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://backend-three-beta-90.vercel.app';

const ContactFloatingWidget = () => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    fetch(`${API}/api/data`)
      .then(res => res.json())
      .then(data => {
        if (data && data.settings) {
          setSettings(data.settings);
        }
      })
      .catch(err => console.error('Failed to load contact settings:', err));
  }, []);

  const getInstagramUrl = () => {
    if (!settings.instagram) return 'https://instagram.com/rayakonstruksi';
    if (settings.instagram.startsWith('http')) return settings.instagram;
    const cleanHandle = settings.instagram.replace(/^@/, '');
    return `https://instagram.com/${cleanHandle}`;
  };

  const getTelegramUrl = () => {
    if (settings.telegram) {
      if (settings.telegram.startsWith('http')) return settings.telegram;
      const cleanHandle = settings.telegram.replace(/^@/, '');
      return `https://t.me/${cleanHandle}`;
    }
    return `https://t.me/rayakonstruksijaya`;
  };

  const whatsappNum = settings.whatsappNumber || '6281234567890';
  const cleanWa = whatsappNum.replace(/\D/g, '');
  const waUrl = `https://wa.me/${cleanWa}?text=Halo%20Raya%20Konstruksi,%20saya%20ingin%20konsultasi%20mengenai%20proyek%20konstruksi.`;

  return (
    <div className="fixed right-5 sm:right-7 bottom-7 sm:bottom-8 z-50 flex flex-col items-end gap-3 select-none">
      
      {/* Sub-icons Menu (Only appears when open) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.85 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-3 items-end mb-1"
          >
            {/* WhatsApp */}
            <div className="flex items-center gap-3">
              <span className="bg-slate-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700 shadow-md whitespace-nowrap">
                {t('widget.wa')}
              </span>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 w-12 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-xl shadow-emerald-600/40 hover:scale-110 active:scale-95 transition-all"
                title={t('widget.wa')}
              >
                <FaWhatsapp size={24} />
              </a>
            </div>

            {/* Instagram */}
            <div className="flex items-center gap-3">
              <span className="bg-slate-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700 shadow-md whitespace-nowrap">
                {t('widget.instagram')}
              </span>
              <a
                href={getInstagramUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 w-12 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow-xl shadow-pink-600/40 hover:scale-110 active:scale-95 transition-all"
                title={t('widget.instagram')}
              >
                <FaInstagram size={22} />
              </a>
            </div>

            {/* Telegram */}
            <div className="flex items-center gap-3">
              <span className="bg-slate-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700 shadow-md whitespace-nowrap">
                {t('widget.telegram')}
              </span>
              <a
                href={getTelegramUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 w-12 rounded-full bg-[#229ED9] hover:bg-[#1d8fc4] text-white flex items-center justify-center shadow-xl shadow-[#229ED9]/40 hover:scale-110 active:scale-95 transition-all"
                title={t('widget.telegram')}
              >
                <FaTelegramPlane size={22} className="-ml-0.5" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Single Floating Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`h-14 w-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer relative ${
          open
            ? 'bg-slate-800 border-2 border-slate-600 rotate-90'
            : 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 shadow-blue-600/50 border border-blue-400/40'
        }`}
        aria-label="Toggle Social Media Contacts"
      >
        {/* Glow pulse dot when closed */}
        {!open && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
          </span>
        )}

        {open ? <FiX size={26} /> : <FiMessageCircle size={26} />}
      </button>

    </div>
  );
};

export default ContactFloatingWidget;
