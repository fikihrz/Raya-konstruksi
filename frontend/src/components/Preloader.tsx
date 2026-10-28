import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  isLoading: boolean;
  onAnimationComplete?: () => void;
  minDisplayTime?: number;
}

export default function Preloader({
  isLoading,
  onAnimationComplete,
  minDisplayTime = 800
}: PreloaderProps) {
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  // Guarantee preloader doesn't flash abruptly, while strictly holding until isLoading (data + dom) is false
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, minDisplayTime);

    return () => clearTimeout(timer);
  }, [minDisplayTime]);

  const canDismiss = minTimeElapsed && !isLoading;

  return (
    <AnimatePresence>
      {!canDismiss && (
        <motion.div
          key="system-preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] }
          }}
          onAnimationComplete={(definition) => {
            if (definition === 'exit' || canDismiss) {
              if (onAnimationComplete) onAnimationComplete();
            }
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white text-slate-900 select-none"
        >
          {/* Minimalist Corporate Center */}
          <div className="flex flex-col items-center justify-center gap-6">
            {/* Clean Corporate Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-16 sm:h-20 w-auto flex items-center justify-center"
            >
              <img
                src="/Profil.png"
                alt="Raya Konstruksi Jaya"
                className="h-full w-auto object-contain max-h-20"
              />
            </motion.div>

            {/* Elegant Slim Indeterminate Progress Line */}
            <div className="w-36 sm:w-44 h-[2px] bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  repeat: Infinity,
                  duration: 1.15,
                  ease: 'easeInOut'
                }}
                className="h-full w-1/2 bg-blue-600 rounded-full"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
