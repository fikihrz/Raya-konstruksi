import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FiHome, FiArrowRight, FiPhoneCall, FiMail, FiMapPin, FiX, FiCalendar, FiMap } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const Home = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [activeAboutTab, setActiveAboutTab] = useState<'story' | 'vision' | 'mission'>('story');

  const services = [
    { title: 'Residential Design', desc: 'Pembangunan rumah tinggal eksklusif, vila modern, dan residensial premium dengan detail arsitektur tingkat tinggi.', img: '/galery/WhatsApp Image 2026-07-01 at 23.38.36 (1).jpeg' },
    { title: 'Commercial Spaces', desc: 'Konstruksi gedung perkantoran mewah, pusat perbelanjaan, dan ruko modern yang fungsional dan estetis.', img: '/galery/WhatsApp Image 2026-07-01 at 23.38.36 (2).jpeg' },
    { title: 'Industrial Development', desc: 'Pembangunan kawasan industri, gudang logistik skala besar, dan pabrik dengan spesifikasi standar tinggi.', img: '/galery/WhatsApp Image 2026-07-01 at 23.38.36.jpeg' },
    { title: 'Infrastructure Works', desc: 'Pengerjaan infrastruktur vital seperti jalan raya modern, jembatan kokoh, dan fasilitas publik.', img: '/galery/WhatsApp Image 2026-07-01 at 23.38.37.jpeg' },
    { title: 'Fabrikasi & Workshop', desc: 'Fabrikasi baja struktural, rangka atap baja ringan, dan komponen logam presisi untuk kebutuhan konstruksi sipil dan industri.', img: '/galery/WhatsApp Image 2026-07-01 at 23.39.22 (2).jpeg' },
    { title: 'Renovasi & Retrofit', desc: 'Alih fungsi dan renovasi total bangunan eksisting, modernisasi fasad, dan perkuatan struktur gedung lama.', img: '/galery/WhatsApp Image 2026-07-01 at 23.39.23.jpeg' }
  ];

  const reasons = [
    { number: '01', title: 'Architectural Excellence', desc: 'Kami mengutamakan keselarasan antara kekuatan struktur bangunan dan keindahan nilai estetika arsitektur modern.' },
    { number: '02', title: 'Premium Material Selection', desc: 'Setiap bahan bangunan dipilih secara ketat untuk menjamin ketahanan konstruksi yang andal melintasi generasi.' },
    { number: '03', title: 'Seamless Workflow & Timeline', desc: 'Manajemen proyek profesional yang transparan dengan penjadwalan presisi memastikan ketepatan waktu serah terima.' }
  ];

  const projects = [
    { title: 'The Glass Horizon Villa', category: 'Residential', location: 'Jakarta', year: 2025, img: '/galery/WhatsApp Image 2026-07-01 at 23.39.21 (1).jpeg', gridClass: 'md:col-span-2 md:row-span-2 h-[500px]', client: 'Bapak Hermawan', budget: 'Rp 4.5 Milyar', duration: '11 Bulan', fullDesc: 'Vila hunian premium dengan fasad kaca penuh untuk memaksimalkan cahaya alami dan pemandangan luar, dilengkapi kolam renang infinity dan sistem smart home modern.' },
    { title: 'Global Nexus Plaza', category: 'Commercial', location: 'Bandung', year: 2024, img: '/galery/WhatsApp Image 2026-07-01 at 23.39.21 (2).jpeg', gridClass: 'md:col-span-1 md:row-span-1 h-[240px]', client: 'PT Nexus Global', budget: 'Rp 12.8 Milyar', duration: '18 Bulan', fullDesc: 'Pusat bisnis terpadu modern 5 lantai di pusat kota Bandung dengan konsep ramah lingkungan dan tata ruang dinamis untuk menampung puluhan startup.' },
    { title: 'Eco Industrial Complex', category: 'Industrial', location: 'Tangerang', year: 2024, img: '/galery/WhatsApp Image 2026-07-01 at 23.39.21.jpeg', gridClass: 'md:col-span-1 md:row-span-1 h-[240px]', client: 'PT Eco Logistics', budget: 'Rp 8.2 Milyar', duration: '14 Bulan', fullDesc: 'Kompleks pergudangan pintar dengan struktur atap berpanel surya, efisiensi sirkulasi udara alami, dan dermaga bongkar muat otomatis berkapasitas besar.' },
    { title: 'Grand Valley Crossing', category: 'Infrastructure', location: 'Surabaya', year: 2025, img: '/galery/WhatsApp Image 2026-07-01 at 23.39.21 (3).jpeg', gridClass: 'md:col-span-1 md:row-span-2 h-[500px]', client: 'Kementerian PUPR', budget: 'Rp 24.5 Milyar', duration: '24 Bulan', fullDesc: 'Proyek strategis jembatan penghubung antar wilayah untuk memperlancar lalu lintas logistik regional dengan menggunakan teknik konstruksi beton prategang.' },
    { title: 'Urban Warehouse Hub', category: 'Infrastructure', location: 'Bekasi', year: 2025, img: '/galery/WhatsApp Image 2026-07-01 at 23.39.22 (1).jpeg', gridClass: 'md:col-span-2 md:row-span-1 h-[240px]', client: 'Mitra Logistik Nusantara', budget: 'Rp 6.1 Milyar', duration: '10 Bulan', fullDesc: 'Pusat distribusi logistik modern yang strategis untuk melayani area perkotaan dengan sistem keamanan tinggi dan manajemen sirkulasi kendaraan terintegrasi.' }
  ];

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center pt-20 overflow-hidden bg-secondary text-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/galery/WhatsApp Image 2026-07-01 at 23.38.36.jpeg"
            alt="Skyscraper Construction"
            className="w-full h-full object-cover opacity-35 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-secondary"></div>
        </div>

        <div className="relative z-10 px-8 max-w-4xl mx-auto w-full flex flex-col items-center space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold leading-tight text-white"
          >
            Building Excellence for a <span className="text-primary-container">Better Future</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed"
          >
            Dari gedung pencakar langit hingga perumahan eksklusif, kami menghadirkan konstruksi presisi tinggi untuk masa depan Anda.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 pt-4"
          >
            <a href="#contact" className="bg-primary-container text-on-primary-container font-semibold px-8 py-4 rounded-lg hover:scale-105 transition-transform shadow-lg">
              Mulai Konsultasi
            </a>
            <a href="#projects" className="border border-white/30 backdrop-blur-md text-white font-semibold px-8 py-4 rounded-lg hover:bg-white/10 transition-colors">
              Lihat Project
            </a>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="relative h-[500px] w-full lg:col-span-6">
            <div className="w-4/5 h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <img
                className="w-full h-full object-cover"
                src="/galery/WhatsApp Image 2026-07-01 at 23.39.21.jpeg"
                alt="Architects working"
              />
            </div>
            <div className="absolute right-0 bottom-4 w-3/5 h-[260px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                className="w-full h-full object-cover"
                src="/galery/WhatsApp Image 2026-07-01 at 23.38.36 (1).jpeg"
                alt="Structural construction detail"
              />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-3">
              <span className="text-primary font-bold uppercase tracking-widest text-xs">Behind The Blueprint</span>
              <h2 className="text-4xl md:text-5xl font-black text-on-surface leading-tight">Raya Konstruksi</h2>
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
                      Lebih dari 15 tahun, Raya Konstruksi telah memimpin industri konstruksi tanah air. Kami mengombinasikan teknologi mutakhir, material pilihan, dan keahlian arsitektur kelas dunia untuk menciptakan bangunan kokoh yang bernilai estetika tinggi.
                    </p>
                    <p className="text-on-surface-variant leading-relaxed text-sm">
                      Didirikan dengan semangat integritas kerja yang tinggi, kami berkomitmen untuk mendampingi setiap tahap konstruksi mulai dari konsep sketsa hingga penyerahan kunci.
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
                    <h4 className="text-lg font-bold text-on-surface mb-2">Pioneering Sustainable Horizons</h4>
                    <p className="text-on-surface-variant leading-relaxed text-base italic">
                      "Menjadi kontraktor terdepan yang inovatif, ramah lingkungan, dan dipercaya sebagai pilar utama pembangunan infrastruktur modern di Indonesia."
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
                      'Memberikan hasil karya terbaik dengan mengutamakan keselamatan kerja (K3) di setiap lokasi proyek.',
                      'Menjaga presisi detail dan keselarasan arsitektur di setiap bangunan yang kami tangani.',
                      'Menjamin transparansi anggaran dan ketepatan waktu serah terima proyek secara konsisten.'
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

      {/* Why Choose Us & Services Section */}
      <section className="py-24 bg-surface-container-low px-8 border-t border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-primary font-bold uppercase tracking-widest text-xs">Our Philosophy</span>
              <h2 className="text-4xl font-black text-on-surface leading-tight">Architectural Integrity.</h2>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Kami tidak sekadar menyusun beton dan besi. Kami merancang ruang hidup dan bisnis yang mengutamakan keamanan tinggi, presisi struktural, serta keselarasan estetika.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-8">
              {reasons.map((reason, i) => (
                <div key={i} className="space-y-4 border-l border-primary/20 pl-6 py-2">
                  <span className="text-xs font-black text-primary uppercase tracking-wider">{reason.number}</span>
                  <h3 className="text-base font-bold text-on-surface">{reason.title}</h3>
                  <p className="text-on-surface-variant text-xs leading-relaxed">{reason.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Services (Layanan) - Clean editorial stack layout */}
          <div className="space-y-12">
            <div className="border-t border-outline-variant/20 pt-12 flex flex-col space-y-4 max-w-3xl">
              <span className="text-primary font-bold uppercase tracking-widest text-xs">Services Overview</span>
              <h2 className="text-3xl md:text-5xl font-black text-on-surface leading-tight">Bidang Keahlian Kami</h2>
              <p className="text-on-surface-variant text-base leading-relaxed">
                Menyediakan layanan penuh mulai dari konsep perencanaan arsitektur, pelaksanaan konstruksi sipil, hingga tahap finishing interior.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, idx) => (
                <div key={idx} className="group relative bg-surface-variant border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between h-[360px]">
                  <div className="h-44 overflow-hidden bg-secondary relative">
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
        </div>
      </section>

      {/* Client Logos Section */}
      <section className="py-20 bg-white border-t border-outline-variant/20 border-b border-outline-variant/20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 mb-12 text-center space-y-2">
          <span className="text-primary font-bold uppercase tracking-widest text-xs">Trusted By</span>
          <h2 className="text-3xl md:text-4xl font-black text-on-surface">Klien & Mitra Kami</h2>
          <p className="text-on-surface-variant text-sm max-w-xl mx-auto">
            Dipercaya oleh perusahaan-perusahaan terkemuka di berbagai sektor industri di Indonesia.
          </p>
        </div>

        {/* Auto-scroll ticker */}
        <div className="relative">
          <div className="flex gap-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]">
            <div className="flex gap-8 animate-[scroll_30s_linear_infinite] min-w-max">
              {[
                { name: 'PT Waskita Karya', abbr: 'WK' },
                { name: 'PT Adhi Karya', abbr: 'AK' },
                { name: 'PT Hutama Karya', abbr: 'HK' },
                { name: 'PT PP (Persero)', abbr: 'PP' },
                { name: 'PT Total Bangun Persada', abbr: 'TBP' },
                { name: 'PT Wijaya Karya', abbr: 'WIKA' },
                { name: 'PT Nindya Karya', abbr: 'NK' },
                { name: 'PT Brantas Abipraya', abbr: 'BA' },
                { name: 'PT Semen Indonesia', abbr: 'SI' },
                { name: 'PT Krakatau Steel', abbr: 'KS' },
                { name: 'PT Pertamina', abbr: 'PTM' },
                { name: 'PT PLN Persero', abbr: 'PLN' },
                { name: 'PT Waskita Karya', abbr: 'WK' },
                { name: 'PT Adhi Karya', abbr: 'AK' },
                { name: 'PT Hutama Karya', abbr: 'HK' },
                { name: 'PT PP (Persero)', abbr: 'PP' },
                { name: 'PT Total Bangun Persada', abbr: 'TBP' },
                { name: 'PT Wijaya Karya', abbr: 'WIKA' },
              ].map((client, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-white/60 border border-outline-variant/20 rounded-xl px-6 py-4 flex-shrink-0 hover:bg-white hover:shadow-md transition-all duration-300 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[9px] font-black text-primary group-hover:text-primary leading-none text-center">{client.abbr}</span>
                  </div>
                  <span className="text-sm font-semibold text-on-surface whitespace-nowrap">{client.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Fabrication Section */}
      <section id="fabrication" className="py-24 px-8 bg-surface-variant border-t border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left: Image */}
            <div className="lg:col-span-5 relative h-[480px]">
              <div className="w-full h-full rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/galery/WhatsApp Image 2026-07-01 at 23.39.22 (3).jpeg"
                  alt="Fabrikasi Baja"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-2/5 h-44 rounded-2xl overflow-hidden shadow-2xl border-4 border-surface">
                <img
                  src="/galery/WhatsApp Image 2026-07-01 at 23.39.22 (2).jpeg"
                  alt="Workshop Fabrikasi"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right: Content */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-3">
                <span className="text-primary font-bold uppercase tracking-widest text-xs">Bidang Unggulan</span>
                <h2 className="text-4xl md:text-5xl font-black text-on-surface leading-tight">
                  Fabrikasi <span className="text-primary">Baja & Logam</span>
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                  Workshop fabrikasi kami dilengkapi mesin CNC, mesin potong laser, dan peralatan las presisi tinggi. Kami mengerjakan berbagai komponen struktural baja dari skala kecil hingga proyek besar.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { num: '01', title: 'Rangka Atap Baja', desc: 'Kuda-kuda baja ringan dan heavy steel untuk bangunan industri, pabrik, dan gudang skala besar.' },
                  { num: '02', title: 'Baja Struktural WF/H-Beam', desc: 'Fabrikasi balok WF, H-Beam, kolom baja, dan komponen frame struktur gedung bertingkat.' },
                  { num: '03', title: 'Custom Metal Works', desc: 'Pengerjaan logam presisi untuk tangga baja, railing, canopy, dan ornamen arsitektur.' },
                  { num: '04', title: 'Mezzanine & Platform', desc: 'Konstruksi mezzanine floor, catwalk industri, dan platform akses untuk fasilitas pergudangan.' },
                  { num: '05', title: 'Scaffolding & Formwork', desc: 'Penyewaan dan fabrikasi perancah (scaffolding) serta bekisting (formwork) untuk proyek konstruksi.' },
                  { num: '06', title: 'Pemasangan & Erection', desc: 'Tim erection berpengalaman untuk pemasangan struktur baja di lapangan dengan standar K3 ketat.' },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-5 bg-white rounded-xl border border-outline-variant/20 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 group">
                    <span className="text-xs font-black text-primary tracking-widest mt-1 flex-shrink-0">{item.num}</span>
                    <div>
                      <h4 className="font-bold text-on-surface text-sm group-hover:text-primary transition-colors">{item.title}</h4>
                      <p className="text-on-surface-variant text-xs mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-4 rounded-xl hover:opacity-90 transition-opacity shadow-md text-sm"
              >
                Konsultasikan Kebutuhan Fabrikasi <FiArrowRight />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16 border-b border-outline-variant/20 pb-8">
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
                    href={`https://wa.me/6281234567890?text=Halo%20Raya%20Konstruksi,%20saya%20ingin%20bertanya%20detail%20mengenai%20proyek%20${encodeURIComponent(selectedProject.title)}.`}
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
            src="/galery/WhatsApp Image 2026-07-01 at 23.38.37.jpeg" 
            alt="Construction site" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1208]/95 via-[#1a1208]/90 to-[#1a1208]/95"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <div className="space-y-6">
            <span className="text-primary-container text-xs font-black uppercase tracking-[0.25em]">Get In Touch</span>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
              Siap Memulai Proyek Anda?
            </h2>
            <p className="text-white/60 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
              Konsultasikan konsep rancang bangun secara gratis bersama tim estimator ahli kami langsung di WhatsApp.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <a 
                href="https://wa.me/6281234567890?text=Halo%20Raya%20Konstruksi,%20saya%20tertarik%20untuk%20konsultasi%20proyek."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-green-500/50 text-white font-bold py-4.5 px-8 rounded-2xl transition-all duration-300 backdrop-blur-md hover:scale-[1.02] shadow-xl text-sm md:text-base"
              >
                <FaWhatsapp className="text-xl text-green-400" />
                <span>Mulai Konsultasi WhatsApp</span>
              </a>
              <a 
                href="mailto:contact@rayakonstruksi.com?subject=Konsultasi Rencana Proyek Raya Konstruksi"
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
