import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ContactFloatingWidget from './components/ContactFloatingWidget';
import Preloader from './components/Preloader';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  const [isSystemLoading, setIsSystemLoading] = useState(true);
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    // Listen to real data readiness from the backend API
    const handleDataReady = () => {
      setIsSystemLoading(false);
    };

    window.addEventListener('app-data-ready', handleDataReady);

    // Fallback safety timeout in case network is disconnected
    const fallbackTimer = setTimeout(() => {
      setIsSystemLoading(false);
    }, 4000);

    return () => {
      window.removeEventListener('app-data-ready', handleDataReady);
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <LanguageProvider>
      {showPreloader && (
        <Preloader
          isLoading={isSystemLoading}
          onAnimationComplete={() => setShowPreloader(false)}
        />
      )}
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
        <Footer />
        <ContactFloatingWidget />
      </div>
    </LanguageProvider>
  );
}

export default App;

