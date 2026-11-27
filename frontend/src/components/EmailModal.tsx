import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  emailAddress: string;
  companyName?: string;
  defaultSubject?: string;
  defaultBody?: string;
  popupImage?: string;
}

export const EmailModal: React.FC<EmailModalProps> = ({
  isOpen,
  onClose,
  emailAddress,
  companyName = 'Raya Konstruksi Jaya',
  defaultSubject = 'Konsultasi Rencana Proyek',
  defaultBody = 'Halo Tim Raya Konstruksi,\n\nSaya ingin berkonsultasi mengenai rencana proyek saya.\nMohon informasi lebih lanjut mengenai tahapan, estimasi biaya, dan jadwal pengerjaan.\n\nTerima kasih.',
  popupImage
}) => {
  const { lang } = useLanguage();
  const cleanEmail = emailAddress || 'contact@rayakonstruksi.com';

  const handleSendEmail = () => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(cleanEmail)}&su=${encodeURIComponent(defaultSubject)}&body=${encodeURIComponent(defaultBody)}`;
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  if (!isOpen) return null;

  const defaultImg = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80';
  const imgSrc = popupImage || defaultImg;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/55 backdrop-blur-xs"
        />

        {/* Horizontal Split Popup (Matching Reference) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-[660px] bg-[#F7F7F7] rounded-3xl shadow-2xl z-10 overflow-hidden grid grid-cols-1 md:grid-cols-2"
        >
          {/* Close Button (Top-Right Corner) */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-black/25 hover:bg-black/45 backdrop-blur-xs text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label={lang === 'EN' ? 'Close' : 'Tutup'}
          >
            <FiX size={16} />
          </button>

          {/* Left Side: Heading + Short Description + Single CTA Button */}
          <div className="flex flex-col items-center justify-center text-center px-8 py-10 sm:py-12 order-2 md:order-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600 mb-1.5">
              {companyName}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
              {lang === 'EN' ? 'GET IN TOUCH' : 'HUBUNGI KAMI'}
            </h3>
            <p className="text-sm text-slate-600 mt-2.5 leading-relaxed max-w-[240px]">
              {lang === 'EN'
                ? `Discuss your construction project directly with our team.`
                : `Konsultasikan proyek konstruksi Anda langsung bersama tim kami.`}
            </p>

            <button
              type="button"
              onClick={handleSendEmail}
              className="mt-6 px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all cursor-pointer active:scale-95 shadow-md shadow-blue-600/25"
            >
              {lang === 'EN' ? 'Send Email' : 'Kirim Email'}
            </button>
          </div>

          {/* Right Side: Full-Bleed Image (Editable from Admin) */}
          <div className="relative h-52 md:h-auto md:min-h-[310px] w-full overflow-hidden bg-neutral-200 order-1 md:order-2">
            <img
              src={imgSrc}
              alt={companyName}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = defaultImg;
              }}
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
