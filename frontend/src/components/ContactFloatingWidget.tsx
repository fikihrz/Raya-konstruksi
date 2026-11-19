import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { FaWhatsapp, FaInstagram, FaTiktok } from 'react-icons/fa';
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

  const getTiktokUrl = () => {
    if (settings.tiktok) {
      if (settings.tiktok.startsWith('http')) return settings.tiktok;
      const cleanHandle = settings.tiktok.replace(/^@/, '');
      return `https://www.tiktok.com/@${cleanHandle}`;
    }
    return `https://www.tiktok.com/@rayakonstruksijaya`;
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
                aria-label="Chat WhatsApp Resmi"
                className="h-12 w-12 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 hover:scale-110 active:scale-95 transition-all"
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
                aria-label="Instagram Resmi"
                className="h-12 w-12 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow-lg shadow-pink-600/30 hover:scale-110 active:scale-95 transition-all"
                title={t('widget.instagram')}
              >
                <FaInstagram size={22} />
              </a>
            </div>

            {/* TikTok */}
            <div className="flex items-center gap-3">
              <span className="bg-slate-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700 shadow-md whitespace-nowrap">
                {t('widget.tiktok')}
              </span>
              <a
                href={getTiktokUrl()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok Resmi"
                className="h-12 w-12 rounded-full bg-black hover:bg-neutral-800 border border-neutral-700 text-white flex items-center justify-center shadow-lg shadow-black/40 hover:scale-110 active:scale-95 transition-all"
                title={t('widget.tiktok')}
              >
                <FaTiktok size={19} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Single Floating Toggle Button (Official WhatsApp styling) */}
      <button
        onClick={() => setOpen(!open)}
        className={`h-14 w-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer relative ${
          open
            ? 'bg-slate-900 hover:bg-slate-800 border-2 border-slate-700'
            : 'bg-[#25D366] hover:bg-[#20ba5a] shadow-emerald-600/40 border border-white/20'
        }`}
        aria-label="Kontak Kami"
        title={open ? "Tutup" : "Hubungi Kami (WhatsApp / Media Sosial)"}
      >
        {open ? <FiX size={26} /> : <FaWhatsapp size={30} className="text-white drop-shadow-sm" />}
      </button>

    </div>
  );
};

export default ContactFloatingWidget;
