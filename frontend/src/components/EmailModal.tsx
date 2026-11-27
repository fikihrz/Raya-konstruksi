import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMail, FiCopy, FiCheck, FiExternalLink, FiSend, FiMessageSquare } from 'react-icons/fi';
import { FaGoogle } from 'react-icons/fa';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  emailAddress: string;
  companyName?: string;
  defaultSubject?: string;
  defaultBody?: string;
}

export const EmailModal: React.FC<EmailModalProps> = ({
  isOpen,
  onClose,
  emailAddress,
  companyName = 'Raya Konstruksi Jaya',
  defaultSubject = 'Konsultasi Rencana Proyek',
  defaultBody = 'Halo Tim Raya Konstruksi,\n\nSaya ingin berkonsultasi mengenai rencana proyek saya.\nMohon informasi lebih lanjut mengenai tahapan, estimasi biaya, dan jadwal pengerjaan.\n\nTerima kasih.'
}) => {
  const [copied, setCopied] = useState(false);
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState(defaultBody);

  const cleanEmail = emailAddress || 'contact@rayakonstruksi.com';

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenGmail = () => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(cleanEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const handleOpenMailto = () => {
    const mailtoUrl = `mailto:${cleanEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
          className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl z-10 text-white space-y-5 my-8"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                <FiMail size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Hubungi via Email</h3>
                <p className="text-xs text-slate-400 mt-0.5">Pilih metode pengiriman email yang paling nyaman:</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Tutup"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Email Address Pill with 1-Click Copy */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Alamat Email Resmi</span>
              <span className="text-sm sm:text-base font-bold text-blue-300 break-all select-all">{cleanEmail}</span>
            </div>
            <button
              onClick={handleCopy}
              className={`flex-shrink-0 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
              title="Salin alamat email ke clipboard"
            >
              {copied ? <FiCheck size={14} className="text-white" /> : <FiCopy size={14} />}
              <span>{copied ? 'Tersalin!' : 'Salin Email'}</span>
            </button>
          </div>

          {/* Quick Options */}
          <div className="space-y-3">
            {/* 1. Gmail Web (Most reliable & popular for everyone) */}
            <button
              type="button"
              onClick={handleOpenGmail}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-red-950/30 via-slate-800/90 to-slate-800/90 hover:from-red-900/40 border border-red-500/30 hover:border-red-400 text-left transition-all duration-200 group cursor-pointer shadow-md hover:shadow-red-900/30"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-red-500/30 group-hover:scale-105 transition-transform flex-shrink-0">
                  <FaGoogle size={18} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white group-hover:text-red-200 transition-colors">Buka via Gmail Web</span>
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">Rekomendasi</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">Buka tab baru Gmail dengan pesan otomatis terisi</p>
                </div>
              </div>
              <FiExternalLink size={16} className="text-slate-400 group-hover:text-white transition-colors flex-shrink-0" />
            </button>

            {/* 2. Default Email Client (Outlook, Apple Mail, etc) */}
            <button
              type="button"
              onClick={handleOpenMailto}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 text-left transition-all duration-200 group cursor-pointer shadow-md"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all flex-shrink-0">
                  <FiMail size={18} />
                </div>
                <div className="min-w-0">
                  <span className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">Aplikasi Email Bawaan</span>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">Outlook, Apple Mail, atau Thunderbird di perangkat Anda</p>
                </div>
              </div>
              <FiSend size={16} className="text-slate-400 group-hover:text-white transition-colors flex-shrink-0" />
            </button>
          </div>

          {/* Message Preview Accordion */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold flex items-center gap-1.5">
                <FiMessageSquare size={13} className="text-blue-400" />
                Draf Pesan Siap Kirim
              </span>
              <span className="text-[11px] text-slate-500">Bisa diedit langsung</span>
            </div>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subjek Email"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:ring-1 focus:ring-blue-500 outline-none"
            />
            <textarea
              rows={3}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Isi pesan email..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
            />
          </div>

          {/* Footer note */}
          <div className="text-center pt-1">
            <span className="text-[11px] text-slate-400">
              Butuh respon cepat? Anda juga bisa berkonsultasi langsung melalui{' '}
              <a 
                href="#contact" 
                onClick={onClose}
                className="text-emerald-400 hover:underline font-semibold"
              >
                WhatsApp Resmi
              </a>
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
