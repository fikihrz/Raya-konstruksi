import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ContactFloatingWidget from './components/ContactFloatingWidget';
import Preloader from './components/Preloader';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <LanguageProvider>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
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

