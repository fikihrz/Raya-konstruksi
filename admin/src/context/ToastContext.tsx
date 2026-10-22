import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message: string;
}

interface ToastContextValue {
  showToast: (type: ToastType, title: string, message: string, duration?: number) => void;
  showSuccess: (title: string, message: string, duration?: number) => void;
  showError: (title: string, message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const showToast = (type: ToastType, title: string, message: string, duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const showSuccess = (title: string, message: string, duration = 4000) => {
    showToast('success', title, message, duration);
  };

  const showError = (title: string, message: string, duration = 5000) => {
    showToast('error', title, message, duration);
  };

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError }}>
      {children}

      {/* Floating Toast Notification Container */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-2xl border transition-all duration-300 animate-slide-in ${
              toast.type === 'success'
                ? 'bg-emerald-950/95 text-emerald-50 border-emerald-500/40 backdrop-blur-md'
                : toast.type === 'error'
                ? 'bg-rose-950/95 text-rose-50 border-rose-500/40 backdrop-blur-md'
                : 'bg-slate-900/95 text-slate-50 border-slate-700/50 backdrop-blur-md'
            }`}
          >
            <div className="mt-0.5 text-xl flex-shrink-0">
              {toast.type === 'success' && <FiCheckCircle className="text-emerald-400" />}
              {toast.type === 'error' && <FiAlertCircle className="text-rose-400" />}
              {toast.type === 'info' && <FiInfo className="text-blue-400" />}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold tracking-tight">{toast.title}</h4>
              <p className="text-xs mt-1 leading-relaxed opacity-90 break-words">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/60 hover:text-white p-1 rounded-lg transition-colors flex-shrink-0"
              aria-label="Tutup notifikasi"
            >
              <FiX className="text-base" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
