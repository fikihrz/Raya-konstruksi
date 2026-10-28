import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  onComplete?: () => void;
  minDuration?: number;
}

export default function Preloader({ onComplete, minDuration = 1400 }: PreloaderProps) {
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFinished(true);
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.5, ease: 'easeInOut' }
          }}
          onAnimationComplete={(definition) => {
            if (definition === 'exit' || isFinished) {
              if (onComplete) onComplete();
            }
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white text-slate-900 select-none"
        >
          {/* Minimalist Corporate Center */}
          <div className="flex flex-col items-center justify-center gap-6">
            {/* Clean Logo without heavy glows or borders */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="h-16 sm:h-20 w-auto flex items-center justify-center"
            >
              <img
                src="/Profil.png"
                alt="Raya Konstruksi Jaya"
                className="h-full w-auto object-contain max-h-20"
              />
            </motion.div>

            {/* Subtle, Ultra-Clean Corporate Progress Line */}
            <div className="w-40 sm:w-48 h-[2px] bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  repeat: Infinity,
                  duration: 1.1,
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
