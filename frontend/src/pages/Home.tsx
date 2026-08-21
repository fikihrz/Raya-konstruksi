import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FiHome, FiArrowRight, FiPhoneCall, FiMail, FiMapPin, FiX, FiCalendar, FiMap, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const Home = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [activeAboutTab, setActiveAboutTab] = useState<'story' | 'vision' | 'mission'>('story');

  const [currentSlide, setCurrentSlide] = useState(0);

  const [services, setServices] = useState<any[]>([]);
  const [reasons, setReasons] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://backend-three-beta-90.vercel.app';
    fetch(`${API_BASE}/api/data`)
      .then(res => res.json())
      .then(data => {
        setServices(data.services || []);
        setReasons(data.reasons || []);
        setProjects(data.projects || []);
        setClients(data.clients || []);
        setSettings(data.settings || {});
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch data:", err);
        setLoading(false);
      });
  }, []);

  // Hero Carousel Auto-Play Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 3);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center bg-secondary text-white font-bold text-2xl">Loading...</div>;
  }

  return (
    <div>
      {/* Visual-First Full-Screen Banner Carousel (Pertamina / Corporate Style) */}
      <section className="relative min-h-[85vh] md:min-h-screen flex items-center justify-center pt-16 pb-16 overflow-hidden bg-slate-950">
        
        {/* Slides Definition */}
        {(() => {
          const slides = [
            {
              id: 1,
              tag: "ARCHITECTURE & DESIGN",
              title: settings.heroTitle || "Membangun Masa Depan Presisi & Berkualitas",
              subtitle: settings.heroDesc || "Solusi terintegrasi konstruksi arsitektur modern & residensial mewah",
              img: settings.heroImage || "/galery/WhatsApp Image 2026-07-01 at 23.38.36.jpeg",
              category: "Residensial & Arsitektur",
              highlight: "Desain Berkelanjutan"
            },
            {
              id: 2,
              tag: "COMMERCIAL DEVELOPMENT",
              title: settings.heroTitle2 || "Konstruksi Megah Komersial & Perkantoran",
              subtitle: settings.heroDesc2 || "Pusat bisnis bernilai tinggi dengan standar keselamatan & mutu terbaik",
              img: settings.heroImage2 || "/galery/WhatsApp Image 2026-07-01 at 23.38.36 (2).jpeg",
              category: "Komersial & Ritel",
              highlight: "Struktur Baja Presisi"
            },
            {
              id: 3,
              tag: "INDUSTRIAL INFRASTRUCTURE",
              title: settings.heroTitle3 || "Infrastruktur Vital & Fabrikasi Industri",
              subtitle: settings.heroDesc3 || "Pabrik, pergudangan logistik, dan infrastruktur strategis nasional",
              img: settings.heroImage3 || "/galery/WhatsApp Image 2026-07-01 at 23.38.37.jpeg",
              category: "Industri & Infrastruktur",
              highlight: "Pengerjaan Tepat Waktu"
            }
          ];

          const current = slides[currentSlide];

          return (
            <>
              {/* Sliding Full-Screen Background Images */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.03 }}
                    transition={{ duration: 0.9, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <img
                      src={current.img}
                      alt={current.title}
                      className="w-full h-full object-cover filter brightness-[0.7] contrast-115"
                    />
                    {/* Atmospheric Lighting & Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/60"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent"></div>
                    {/* Subtle 3D Blueprint Mesh */}
                    <div className="absolute inset-0 hero-3d-grid opacity-25 pointer-events-none"></div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Main Content Layout (Vertically Centered and Balanced) */}
              <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 flex items-center">
                
                {/* Left-Aligned Clean Headline */}
                <div className="max-w-2xl text-left my-auto">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`content-${currentSlide}`}
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-4"
                    >
                      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] tracking-tight drop-shadow-lg">
                        {current.title}
                      </h1>

                      <p className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed drop-shadow-md max-w-lg">
                        {current.subtitle}
                      </p>

                      <div className="pt-3">
                        <a
                          href="#contact"
                          className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-xl shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all"
                        >
                          <span>Hubungi Kami</span>
                          <span>→</span>
                        </a>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Clean Edge-to-Edge Navigation Arrows (Pertamina Style) */}
              <button
                onClick={() => setCurrentSlide(prev => (prev === 0 ? 2 : prev - 1))}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-12 sm:w-16 h-20 sm:h-24 bg-blue-600/90 hover:bg-blue-600 text-white flex items-center justify-center transition-all z-20 shadow-2xl rounded-r-xl group focus:outline-none"
                aria-label="Previous Banner"
              >
                <FiChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setCurrentSlide(prev => (prev + 1) % 3)}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-12 sm:w-16 h-20 sm:h-24 bg-blue-600/90 hover:bg-blue-600 text-white flex items-center justify-center transition-all z-20 shadow-2xl rounded-l-xl group focus:outline-none"
                aria-label="Next Banner"
              >
                <FiChevronRight size={32} className="group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Clean Bottom Pagination Dots */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      currentSlide === idx ? 'w-8 bg-blue-500' : 'w-2.5 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          );
        })()}
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-8 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="relative h-[500px] w-full lg:col-span-6">
            <div className="w-4/5 h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <img
                className="w-full h-full object-cover"
                src={settings.aboutImage1 || '/galery/WhatsApp Image 2026-07-01 at 23.39.21.jpeg'}
                alt="Architects working"
              />
            </div>
            <div className="absolute right-0 bottom-4 w-3/5 h-[260px] rounded-2xl overflow-hidden shadow-2xl border-4 border-blue-100">
              <img
                className="w-full h-full object-cover"
                src={settings.aboutImage2 || '/galery/WhatsApp Image 2026-07-01 at 23.38.36 (1).jpeg'}
                alt="Structural construction detail"
              />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-3">
              <span className="text-primary font-bold uppercase tracking-widest text-xs">{settings.aboutBadge || 'Behind The Blueprint'}</span>
              <h2 className="text-4xl md:text-5xl font-black text-on-surface leading-tight">{settings.aboutTitle || 'Raya Konstruksi'}</h2>
            </div>

            <div className="flex border-b border-outline-variant/30 text-sm font-semibold">
              {[
                { id: 'story', label: 'The Story' },
                { id: 'vision', label: 'Our Vision' },
                { id: 'mission', label: 'Our Mission' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveAboutTab(tab.id as any)}
                  className={`pb-4 pr-6 relative transition-colors ${activeAboutTab === tab.id ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  {tab.label}
                  {activeAboutTab === tab.id && (
                    <motion.div
                      layoutId="activeAboutTabLine"
                      className="absolute bottom-0 left-0 right-6 h-0.5 bg-primary"
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="min-h-[160px] flex items-center">
              <AnimatePresence mode="wait">
                {activeAboutTab === 'story' && (
                  <motion.div
                    key="story"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <p className="text-on-surface-variant leading-relaxed text-base">
                      {settings.aboutStory || ''}
                    </p>
                    <p className="text-on-surface-variant leading-relaxed text-sm">
                      {settings.aboutStory2 || ''}
                    </p>
                  </motion.div>
                )}

                {activeAboutTab === 'vision' && (
                  <motion.div
                    key="vision"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="border-l-2 border-primary pl-6 py-2"
                  >
                    <h4 className="text-lg font-bold text-on-surface mb-2">{settings.visionTitle || ''}</h4>
                    <p className="text-on-surface-variant leading-relaxed text-base italic">
                      "{settings.visionDesc || ''}"
                    </p>
                  </motion.div>
                )}

                {activeAboutTab === 'mission' && (
                  <motion.div
                    key="mission"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                  >
                    {[
                      settings.mission1 || '',
                      settings.mission2 || '',
                      settings.mission3 || ''
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-3 items-start">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <p className="text-on-surface-variant text-sm leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Kenapa Memilih Kami Section */}
      <section className="py-24 bg-slate-900 px-8 relative overflow-hidden">
        {/* Abstract background blobs for premium feel */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-4 mb-16">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold uppercase tracking-widest text-[10px]">Why Choose Us</span>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">{settings.whyTitle || 'Kenapa Memilih Kami?'}</h2>
            <p className="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed">
              {settings.whyDesc || ''}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reasons.map((reason, i) => (
              <div key={i} className="group relative bg-slate-800/40 hover:bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 hover:border-blue-500/50 p-8 rounded-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/20 flex flex-col items-center md:items-start text-center md:text-left space-y-5">
                <div className="w-14 h-14 flex-shrink-0 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/5 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                  <span className="text-xl font-black text-blue-400">{reason.number}</span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">{reason.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{reason.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Services (Layanan) - Clean editorial stack layout */}
      <section className="py-24 bg-white px-8">
        <div id="services" className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col space-y-4 max-w-3xl">
              <span className="text-primary font-bold uppercase tracking-widest text-xs">Services Overview</span>
              <h2 className="text-3xl md:text-5xl font-black text-on-surface leading-tight">{settings.servicesTitle || 'Bidang Keahlian Kami'}</h2>
              <p className="text-on-surface-variant text-base leading-relaxed">
                {settings.servicesDesc || ''}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, idx) => (
                <div key={idx} className="group relative bg-white border border-blue-100 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between h-[360px]">
                  <div className="h-44 overflow-hidden bg-blue-900 relative">
                    <img
                      src={service.img}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors duration-300">
                        {service.title}
                      </h3>
                      <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                        {service.desc}
                      </p>
                    </div>
                    <a href="#contact" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:gap-3 transition-all pt-4">
                      Konsultasi Layanan <FiArrowRight />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
      </section>

      {/* Client Logos Section */}
      <section className="py-20 bg-blue-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 mb-12 text-center space-y-2">
          <span className="text-blue-400 font-bold uppercase tracking-widest text-xs">Trusted By</span>
          <h2 className="text-3xl md:text-4xl font-black text-white">{settings.clientsTitle || 'Klien & Mitra Kami'}</h2>
          <p className="text-blue-200/70 text-sm max-w-xl mx-auto">
            {settings.clientsDesc || ''}
          </p>
        </div>

        {/* Auto-scroll ticker */}
        <div className="relative">
          <div className="flex gap-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]">
            <div className="flex gap-8 animate-[scroll_30s_linear_infinite] min-w-max">
              {[...clients, ...clients].map((client, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-blue-900/40 border border-blue-800/50 rounded-xl px-6 py-4 flex-shrink-0 hover:border-blue-400 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-800/50 flex items-center justify-center flex-shrink-0">
                    <span className="text-[9px] font-black text-blue-300 leading-none text-center">{client.abbr}</span>
                  </div>
                  <span className="text-sm font-semibold text-white whitespace-nowrap">{client.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16 border-b border-slate-200 pb-8">
          <div className="space-y-3">
            <span className="text-primary font-bold uppercase tracking-widest text-sm">Portfolio Project</span>
            <h2 className="text-4xl md:text-5xl font-black text-on-surface">Architectural Masterpieces</h2>
          </div>
          <div className="flex flex-wrap gap-2 md:self-end">
            {['All', 'Residential', 'Commercial', 'Infrastructure'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full border transition-all text-xs font-bold ${activeCategory === cat ? 'bg-primary border-primary text-white shadow-sm' : 'border-outline/50 hover:border-primary text-on-surface bg-white/50'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-max">
          {filteredProjects.map((p, i) => (
            <div
              key={i}
              onClick={() => setSelectedProject(p)}
              className={`group relative overflow-hidden rounded-xl bg-secondary shadow-md cursor-pointer ${p.gridClass}`}
            >
              <img
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-60 transition-all duration-700"
                src={p.img}
                alt={p.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
                <span className="text-primary-container font-bold text-xs uppercase tracking-wider mb-1">
                  {p.category}
                </span>
                <h3 className="text-2xl font-black leading-tight text-white mb-2">
                  {p.title}
                </h3>
                <div className="flex justify-between items-center text-xs text-white/70 border-t border-white/10 pt-3 mt-1">
                  <span>{p.location}</span>
                  <span>{p.year}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* Interactive Project Details Lightbox Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-surface text-on-surface border border-outline-variant/30 max-w-4xl w-full rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/80 text-white p-2.5 rounded-full transition-colors"
              >
                <FiX className="text-xl" />
              </button>

              <div className="h-64 md:h-full relative bg-secondary">
                <img
                  src={selectedProject.img}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>

              <div className="p-8 md:p-12 flex flex-col justify-between space-y-6 overflow-y-auto max-h-[85vh]">
                <div className="space-y-4">
                  <span className="text-primary font-bold uppercase tracking-widest text-xs">
                    Project Details • {selectedProject.category}
                  </span>
                  <h3 className="text-3xl font-black text-on-surface leading-tight">
                    {selectedProject.title}
                  </h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">
                    {selectedProject.fullDesc}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-outline-variant/30 pt-6">
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">Client</span>
                    <span className="text-sm font-semibold text-on-surface">{selectedProject.client}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">Nilai Proyek</span>
                    <span className="text-sm font-semibold text-primary">{selectedProject.budget}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <FiMap className="text-primary text-base" />
                    <div>
                      <span className="block text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">Lokasi</span>
                      <span className="text-sm font-semibold text-on-surface">{selectedProject.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <FiCalendar className="text-primary text-base" />
                    <div>
                      <span className="block text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">Durasi</span>
                      <span className="text-sm font-semibold text-on-surface">{selectedProject.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <a
                    href={`https://wa.me/${settings.whatsappNumber || '6281234567890'}?text=Halo%20${encodeURIComponent(settings.companyName || 'Raya Konstruksi')},%20saya%20ingin%20bertanya%20detail%20mengenai%20proyek%20${encodeURIComponent(selectedProject.title)}.`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-primary hover:opacity-95 text-white font-bold py-3 rounded-lg text-sm transition-opacity"
                  >
                    Tanyakan Tentang Proyek Ini
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Section - Clean Centered Dark Banner */}
      <section id="contact" className="relative py-32 px-8 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={settings.contactImage || '/galery/WhatsApp Image 2026-07-01 at 23.38.37.jpeg'} 
            alt="Construction site" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/95 via-blue-950/90 to-blue-950/95"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <div className="space-y-6">
            <span className="text-primary-container text-xs font-black uppercase tracking-[0.25em]">Get In Touch</span>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
              {settings.contactTitle || 'Siap Memulai Proyek Anda?'}
            </h2>
            <p className="text-white/60 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
              {settings.contactDesc || ''}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <a 
                href={`https://wa.me/${settings.whatsappNumber || '6281234567890'}?text=Halo%20${encodeURIComponent(settings.companyName || 'Raya Konstruksi')},%20saya%20tertarik%20untuk%20konsultasi%20proyek.`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-green-500/50 text-white font-bold py-4.5 px-8 rounded-2xl transition-all duration-300 backdrop-blur-md hover:scale-[1.02] shadow-xl text-sm md:text-base"
              >
                <FaWhatsapp className="text-xl text-green-400" />
                <span>Mulai Konsultasi WhatsApp</span>
              </a>
              <a 
                href={`mailto:${settings.emailAddress || 'contact@rayakonstruksi.com'}?subject=Konsultasi Rencana Proyek ${settings.companyName || 'Raya Konstruksi'}`}
                className="inline-flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary-container/50 text-white font-bold py-4.5 px-8 rounded-2xl transition-all duration-300 backdrop-blur-md hover:scale-[1.02] shadow-xl text-sm md:text-base"
              >
                <FiMail className="text-xl text-primary-container" />
                <span>Kirim Penawaran Email</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
