import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { FiChevronDown, FiSearch, FiMenu, FiX, FiCheck } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  // Dropdown States
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const { lang, setLang, t } = useLanguage();

  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (id: string, category?: string) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    setLangDropdownOpen(false);
    
    if (category !== undefined) {
      window.dispatchEvent(new CustomEvent('project-filter', { detail: category }));
    }

    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchVal.trim();
    if (!query) {
      setSearchActive(false);
      return;
    }

    const target = query.toLowerCase();
    if (target.includes('layanan') || target.includes('service') || target.includes('desain') || target.includes('bangun')) {
      handleNavClick('services');
    } else if (target.includes('tentang') || target.includes('about') || target.includes('profil') || target.includes('visi') || target.includes('misi')) {
      handleNavClick('about');
    } else if (target.includes('unggul') || target.includes('why') || target.includes('keunggulan')) {
      handleNavClick('why-us');
    } else if (target.includes('klien') || target.includes('client') || target.includes('review') || target.includes('testimoni') || target.includes('ulasan')) {
      handleNavClick('clients');
    } else if (target.includes('kontak') || target.includes('wa') || target.includes('contact') || target.includes('telepon') || target.includes('email')) {
      handleNavClick('contact');
    } else {
      // Broadcast search event to filter projects live on Home page
      window.dispatchEvent(new CustomEvent('site-search', { detail: query }));
      handleNavClick('projects');
    }

    setSearchActive(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top Thin Blue Line */}
      <div className={`h-[3px] w-full transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-80'} bg-gradient-to-r from-blue-600 via-blue-400 to-blue-500`} />

      {/* Main Navbar Bar */}
      <nav
        ref={navRef}
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-black/90 backdrop-blur-md shadow-2xl border-b border-white/10'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="w-full flex items-stretch justify-between h-16 sm:h-20">
          
          {/* Left: Blue Brand Badge */}
          <div className="flex items-stretch ml-4 sm:ml-8 lg:ml-12">
            <Link
              to="/"
              className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 px-5 sm:px-7 transition-colors self-stretch shadow-md select-none"
            >
              <div className="h-10 sm:h-12 w-auto flex items-center justify-center flex-shrink-0">
                <img
                  src="/Profil.png"
                  alt="Raya Konstruksi Jaya Logo"
                  className="h-full w-auto max-w-[120px] object-contain drop-shadow"
                />
              </div>
              <span className="text-base sm:text-lg lg:text-xl font-bold text-white tracking-wide uppercase leading-tight">
                Raya Konstruksi Jaya
              </span>
            </Link>
          </div>

          {/* Center / Right: Clickable Navigation Links with Functional Dropdowns */}
          <div className="hidden lg:flex items-center space-x-7 mr-6 sm:mr-10 lg:mr-14 text-sm font-normal text-white uppercase tracking-wider">
            
            {/* 1. Tentang Kami Dropdown */}
            <div
              className="relative py-2"
              onMouseEnter={() => setActiveDropdown('about')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => handleNavClick('about')}
                className={`flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none ${activeDropdown === 'about' ? 'text-blue-400' : 'hover:text-blue-400'}`}
              >
                <span>{t('nav.about')}</span>
                <FiChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${activeDropdown === 'about' ? 'rotate-180 text-blue-400' : 'text-white/70'}`}
                />
              </button>

              {/* Breakdown Menu for Tentang Kami */}
              {activeDropdown === 'about' && (
                <div className="absolute top-full left-0 pt-2 w-52 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-2xl py-2 overflow-hidden">
                    <button
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('about-tab', { detail: 'story' }));
                        handleNavClick('about');
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-200 hover:text-white hover:bg-blue-600/30 transition-colors block cursor-pointer"
                    >
                      {t('nav.about.story')}
                    </button>
                    <button
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('about-tab', { detail: 'vision' }));
                        handleNavClick('about');
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-200 hover:text-white hover:bg-blue-600/30 transition-colors block cursor-pointer"
                    >
                      {t('nav.about.vision')}
                    </button>
                    <button
                      onClick={() => handleNavClick('clients')}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-200 hover:text-white hover:bg-blue-600/30 transition-colors block cursor-pointer border-t border-slate-800"
                    >
                      {t('nav.about.clients')}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Layanan Dropdown */}
            <div
              className="relative py-2"
              onMouseEnter={() => setActiveDropdown('services')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => handleNavClick('services')}
                className={`flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none ${activeDropdown === 'services' ? 'text-blue-400' : 'hover:text-blue-400'}`}
              >
                <span>{t('nav.services')}</span>
                <FiChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${activeDropdown === 'services' ? 'rotate-180 text-blue-400' : 'text-white/70'}`}
                />
              </button>

              {/* Breakdown Menu for Layanan */}
              {activeDropdown === 'services' && (
                <div className="absolute top-full left-0 pt-2 w-56 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-2xl py-2 overflow-hidden">
                    <button
                      onClick={() => handleNavClick('services')}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-200 hover:text-white hover:bg-blue-600/30 transition-colors block cursor-pointer"
                    >
                      {t('nav.services.residential')}
                    </button>
                    <button
                      onClick={() => handleNavClick('services')}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-200 hover:text-white hover:bg-blue-600/30 transition-colors block cursor-pointer"
                    >
                      {t('nav.services.commercial')}
                    </button>
                    <button
                      onClick={() => handleNavClick('services')}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-200 hover:text-white hover:bg-blue-600/30 transition-colors block cursor-pointer"
                    >
                      {t('nav.services.infrastructure')}
                    </button>
                    <button
                      onClick={() => handleNavClick('services')}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-200 hover:text-white hover:bg-blue-600/30 transition-colors block cursor-pointer"
                    >
                      {t('nav.services.fabrication')}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Proyek Dropdown */}
            <div
              className="relative py-2"
              onMouseEnter={() => setActiveDropdown('projects')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => handleNavClick('projects')}
                className={`flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none ${activeDropdown === 'projects' ? 'text-blue-400' : 'hover:text-blue-400'}`}
              >
                <span>{t('nav.projects')}</span>
                <FiChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${activeDropdown === 'projects' ? 'rotate-180 text-blue-400' : 'text-white/70'}`}
                />
              </button>

              {/* Breakdown Menu for Proyek */}
              {activeDropdown === 'projects' && (
                <div className="absolute top-full left-0 pt-2 w-52 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-2xl py-2 overflow-hidden">
                    <button
                      onClick={() => handleNavClick('projects', 'All')}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-200 hover:text-white hover:bg-blue-600/30 transition-colors block cursor-pointer"
                    >
                      {t('nav.projects.all')}
                    </button>
                    <button
                      onClick={() => handleNavClick('projects', 'Residential')}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-200 hover:text-white hover:bg-blue-600/30 transition-colors block cursor-pointer"
                    >
                      {t('nav.projects.residential')}
                    </button>
                    <button
                      onClick={() => handleNavClick('projects', 'Commercial')}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-200 hover:text-white hover:bg-blue-600/30 transition-colors block cursor-pointer"
                    >
                      {t('nav.projects.commercial')}
                    </button>
                    <button
                      onClick={() => handleNavClick('projects', 'Infrastructure')}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-200 hover:text-white hover:bg-blue-600/30 transition-colors block cursor-pointer"
                    >
                      {t('nav.projects.infrastructure')}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Keunggulan Link */}
            <button
              onClick={() => handleNavClick('why-us')}
              className="hover:text-blue-400 transition-colors py-2 cursor-pointer focus:outline-none uppercase"
            >
              {t('nav.whyUs')}
            </button>

            {/* Vertical Separator */}
            <div className="h-6 w-[1px] bg-white/20" />

            {/* Language Switcher with Clickable Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-blue-400 hover:text-white transition-all cursor-pointer focus:outline-none border border-white/10 text-xs font-bold"
                title="Pilih Bahasa / Switch Language"
                aria-label="Pilih Bahasa"
              >
                <span>{lang}</span>
                <FiChevronDown size={13} className={`transition-transform duration-200 ${langDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {langDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-36 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-50 animate-in fade-in slide-in-from-top-1">
                  <button
                    onClick={() => {
                      setLang('ID');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full px-3.5 py-2 text-xs flex items-center justify-between cursor-pointer transition-colors ${lang === 'ID' ? 'text-blue-400 font-bold bg-blue-900/30' : 'text-slate-300 hover:bg-slate-800'}`}
                  >
                    <span>🇮🇩 Indonesia</span>
                    {lang === 'ID' && <FiCheck size={14} />}
                  </button>
                  <button
                    onClick={() => {
                      setLang('EN');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full px-3.5 py-2 text-xs flex items-center justify-between cursor-pointer transition-colors ${lang === 'EN' ? 'text-blue-400 font-bold bg-blue-900/30' : 'text-slate-300 hover:bg-slate-800'}`}
                  >
                    <span>🇬🇧 English</span>
                    {lang === 'EN' && <FiCheck size={14} />}
                  </button>
                </div>
              )}
            </div>

            {/* Search Icon / Input */}
            {searchActive ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center bg-slate-900 border border-blue-500 rounded-full px-3 py-1">
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder={t('nav.searchPlaceholder')}
                  autoFocus
                  className="bg-transparent text-white text-xs w-28 sm:w-36 focus:outline-none placeholder-slate-400"
                />
                <button type="submit" aria-label="Submit pencarian" className="text-blue-400 hover:text-white p-1 cursor-pointer">
                  <FiSearch size={14} />
                </button>
                <button type="button" onClick={() => setSearchActive(false)} aria-label="Tutup pencarian" className="text-slate-400 hover:text-white p-1 cursor-pointer">
                  <FiX size={14} />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchActive(true)}
                className="text-blue-400 hover:text-white transition-colors p-2 cursor-pointer focus:outline-none"
                aria-label="Cari"
                title="Pencarian Cepat"
              >
                <FiSearch size={18} />
              </button>
            )}

            {/* CTA Button: Kontak */}
            <button
              onClick={() => handleNavClick('contact')}
              className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs tracking-widest uppercase font-bold shadow-lg shadow-blue-600/35 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              {t('nav.contact')}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden px-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-blue-400 transition-colors p-2 cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-950/98 border-t border-white/10 px-6 py-5 space-y-4 text-base font-normal text-white uppercase tracking-wider">
            {/* Mobile Nav Links */}
            <div className="space-y-1">
              <button
                onClick={() => handleNavClick('about')}
                className="w-full text-left py-2 hover:text-blue-400 transition-colors cursor-pointer block"
              >
                {t('nav.about')}
              </button>
              <button
                onClick={() => handleNavClick('services')}
                className="w-full text-left py-2 hover:text-blue-400 transition-colors cursor-pointer block"
              >
                {t('nav.services')}
              </button>
              <button
                onClick={() => handleNavClick('projects')}
                className="w-full text-left py-2 hover:text-blue-400 transition-colors cursor-pointer block"
              >
                {t('nav.projects')}
              </button>
              <button
                onClick={() => handleNavClick('why-us')}
                className="w-full text-left py-2 hover:text-blue-400 transition-colors cursor-pointer block"
              >
                {t('nav.whyUs')}
              </button>
            </div>

            {/* Mobile Language Switcher */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400 normal-case">Pilih Bahasa / Language:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLang('ID')}
                  className={`px-3 py-1 rounded text-xs font-bold cursor-pointer transition-all ${lang === 'ID' ? 'bg-blue-600 text-white shadow' : 'bg-slate-800 text-slate-300'}`}
                >
                  🇮🇩 ID
                </button>
                <button
                  onClick={() => setLang('EN')}
                  className={`px-3 py-1 rounded text-xs font-bold cursor-pointer transition-all ${lang === 'EN' ? 'bg-blue-600 text-white shadow' : 'bg-slate-800 text-slate-300'}`}
                >
                  🇬🇧 EN
                </button>
              </div>
            </div>

            {/* Mobile CTA Button */}
            <button
              onClick={() => handleNavClick('contact')}
              className="block w-full py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-center uppercase tracking-widest shadow-lg shadow-blue-600/30 cursor-pointer"
            >
              {t('nav.contact')}
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
