import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <div id="home" className="relative h-screen flex items-center justify-center bg-gray-900 text-white overflow-hidden">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1541888086225-f6406f32e92c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Construction Background" 
          className="w-full h-full object-cover opacity-40"
        />
      </div>
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold mb-6 text-white"
        >
          Membangun Masa Depan dengan <span className="text-orange-500">Kualitas Terbaik</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-xl md:text-2xl mb-10 text-gray-200"
        >
          Kontraktor terpercaya dengan pengalaman lebih dari 15 tahun memberikan solusi konstruksi inovatif dan profesional.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <a href="#contact" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition-colors text-lg shadow-lg">
            Konsultasi Sekarang
          </a>
          <a href="#projects" className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white font-bold py-3 px-8 rounded-full transition-colors text-lg shadow-lg">
            Lihat Project
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
