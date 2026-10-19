import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ID' | 'EN';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: string) => string;
  translateText: (text: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  ID: {
    // Navbar
    'nav.brandSubtitle': 'Teknik Sipil & Konstruksi',
    'nav.about': 'Tentang Kami',
    'nav.services': 'Layanan',
    'nav.projects': 'Proyek',
    'nav.whyUs': 'Keunggulan',
    'nav.contact': 'Kontak',
    'nav.searchPlaceholder': 'Cari...',
    'nav.about.story': 'Kisah & Sejarah',
    'nav.about.vision': 'Visi & Misi',
    'nav.about.clients': 'Klien & Mitra',
    'nav.services.residential': 'Residensial & Vila',
    'nav.services.commercial': 'Komersial & Gedung',
    'nav.services.infrastructure': 'Infrastruktur Sipil',
    'nav.services.fabrication': 'Fabrikasi Baja',
    'nav.projects.all': 'Semua Portofolio',
    'nav.projects.residential': 'Proyek Residensial',
    'nav.projects.commercial': 'Proyek Komersial',
    'nav.projects.infrastructure': 'Proyek Infrastruktur',

    // Hero
    'hero.tag1': 'ARSITEKTUR & DESAIN',
    'hero.title1': 'Membangun Masa Depan Presisi & Berkualitas',
    'hero.sub1': 'Solusi terintegrasi konstruksi arsitektur modern & residensial mewah dengan standar mutu internasional.',
    'hero.cta1': 'Lihat Layanan Arsitektur',

    'hero.tag2': 'PENGEMBANGAN KOMERSIAL',
    'hero.title2': 'Konstruksi Megah Komersial & Perkantoran',
    'hero.sub2': 'Pusat bisnis bernilai tinggi dengan standar keselamatan kerja, keandalan struktur, dan efisiensi waktu.',
    'hero.cta2': 'Eksplorasi Proyek Komersial',

    'hero.tag3': 'INFRASTRUKTUR INDUSTRI',
    'hero.title3': 'Infrastruktur Vital & Fabrikasi Industri',
    'hero.sub3': 'Pabrik, pergudangan logistik, dan infrastruktur strategis nasional berdaya tahan tinggi.',
    'hero.cta3': 'Kapabilitas Industri Kami',

    // About
    'about.badge': 'Profil Perusahaan',
    'about.title': 'Raya Konstruksi Jaya',
    'about.tabStory': 'Kisah Kami',
    'about.tabVision': 'Visi Kami',
    'about.tabMission': 'Misi Kami',
    'about.story': 'Lebih dari 15 tahun, Raya Konstruksi Jaya telah memimpin industri konstruksi tanah air. Kami mengombinasikan teknologi mutakhir, material pilihan, dan keahlian arsitektur kelas dunia untuk menciptakan bangunan kokoh yang bernilai estetika tinggi.',
    'about.story2': 'Didirikan dengan semangat integritas kerja yang tinggi, kami berkomitmen untuk mendampingi setiap tahap konstruksi mulai dari konsep sketsa hingga penyerahan kunci.',
    'about.visionTitle': 'Pelopor Pembangunan Berkelanjutan',
    'about.visionDesc': 'Menjadi kontraktor terdepan yang inovatif, ramah lingkungan, dan dipercaya sebagai pilar utama pembangunan infrastruktur modern di Indonesia.',
    'about.mission1': 'Memberikan hasil karya terbaik dengan mengutamakan keselamatan kerja (K3) di setiap lokasi proyek.',
    'about.mission2': 'Menjaga presisi detail dan keselarasan arsitektur di setiap bangunan yang kami tangani.',
    'about.mission3': 'Menjamin transparansi anggaran dan ketepatan waktu serah terima proyek secara konsisten.',

    // Why Us
    'whyUs.badge': 'Keunggulan Kami',
    'whyUs.title': 'Kenapa Memilih Kami?',
    'whyUs.desc': 'Kami tidak sekadar menyusun beton dan besi. Kami merancang ruang hidup dan bisnis yang mengutamakan keamanan tinggi, presisi struktural, serta keselarasan estetika.',
    'whyUs.r1.title': 'Keunggulan Arsitektur',
    'whyUs.r1.desc': 'Kami mengutamakan keselarasan antara kekuatan struktur bangunan dan keindahan nilai estetika arsitektur modern.',
    'whyUs.r2.title': 'Pilihan Material Premium',
    'whyUs.r2.desc': 'Setiap bahan bangunan dipilih secara ketat untuk menjamin ketahanan konstruksi yang andal melintasi generasi.',
    'whyUs.r3.title': 'Alur Kerja & Waktu Presisi',
    'whyUs.r3.desc': 'Manajemen proyek profesional yang transparan dengan penjadwalan presisi memastikan ketepatan waktu serah terima.',

    // Services
    'services.badge': 'Ikhtisar Layanan',
    'services.title': 'Bidang Keahlian Kami',
    'services.desc': 'Menyediakan layanan penuh mulai dari konsep perencanaan arsitektur, pelaksanaan konstruksi sipil, hingga tahap finishing interior.',
    'services.btnConsult': 'Konsultasi Layanan',
    'services.s1.title': 'Desain Residensial',
    'services.s1.desc': 'Pembangunan rumah tinggal eksklusif, vila modern, dan residensial premium dengan detail arsitektur tingkat tinggi.',
    'services.s2.title': 'Ruang Komersial',
    'services.s2.desc': 'Konstruksi gedung perkantoran mewah, pusat perbelanjaan, dan ruko modern yang fungsional dan estetis.',
    'services.s3.title': 'Kawasan Industri',
    'services.s3.desc': 'Pembangunan kawasan industri, gudang logistik skala besar, dan pabrik dengan spesifikasi standar tinggi.',
    'services.s4.title': 'Pekerjaan Infrastruktur',
    'services.s4.desc': 'Pengerjaan infrastruktur vital seperti jalan raya modern, jembatan kokoh, dan fasilitas publik.',
    'services.s5.title': 'Fabrikasi & Bengkel Baja',
    'services.s5.desc': 'Fabrikasi baja struktural, rangka atap baja ringan, dan komponen logam presisi untuk kebutuhan konstruksi sipil dan industri.',
    'services.s6.title': 'Renovasi & Retrofit',
    'services.s6.desc': 'Alih fungsi dan renovasi total bangunan eksisting, modernisasi fasad, dan perkuatan struktur gedung lama.',

    // Reviews & Clients
    'reviews.badge': 'Testimoni & Kemitraan',
    'reviews.title': 'Ulasan & Klien Terpercaya',
    'reviews.desc': 'Bukti kepuasan nyata dari para mitra korporat, arsitek, dan pemilik proyek yang telah mempercayakan konstruksi kepada Raya Konstruksi Jaya.',
    'reviews.btnWrite': 'Tulis Ulasan Anda',
    'reviews.trustedBy': 'Dipercaya Oleh Berbagai Perusahaan Terkemuka:',

    // Review Modal Form
    'modal.title': 'Tulis Ulasan Klien',
    'modal.subtitle': 'Beri Tanggapan Anda',
    'modal.desc': 'Ulasan Anda sangat berarti bagi pengembangan mutu layanan Raya Konstruksi Jaya.',
    'modal.nameLabel': 'Nama Lengkap *',
    'modal.companyLabel': 'Perusahaan / Afiliasi',
    'modal.roleLabel': 'Jabatan / Peran',
    'modal.typeLabel': 'Jenis Proyek',
    'modal.ratingLabel': 'Penilaian / Rating',
    'modal.reviewLabel': 'Ulasan & Pengalaman Anda *',
    'modal.submitBtn': 'Kirim Ulasan Sekarang',
    'modal.submitting': 'Mengirim...',

    // Projects
    'projects.badge': 'Portofolio Proyek',
    'projects.title': 'Mahakarya Arsitektur',
    'projects.desc': 'Eksplorasi portofolio karya arsitektur dan konstruksi presisi tinggi yang telah kami selesaikan di berbagai penjuru wilayah.',
    'projects.filterAll': 'Semua',
    'projects.filterResidential': 'Residensial',
    'projects.filterCommercial': 'Komersial',
    'projects.filterInfrastructure': 'Infrastruktur',
    'projects.detailsHeader': 'Detail Proyek',
    'projects.client': 'Klien',
    'projects.budget': 'Nilai Proyek',
    'projects.location': 'Lokasi',
    'projects.duration': 'Durasi',
    'projects.inquire': 'Tanyakan Tentang Proyek Ini',
    'projects.prev': 'Sebelumnya',
    'projects.next': 'Berikutnya',

    // Contact
    'contact.badge': 'Hubungi Kami',
    'contact.title': 'Siap Memulai Proyek Anda?',
    'contact.desc': 'Konsultasikan konsep rancang bangun secara gratis bersama tim estimator ahli kami langsung di WhatsApp atau Email.',
    'contact.btnWa': 'Mulai Konsultasi WhatsApp',
    'contact.btnEmail': 'Kirim Penawaran Email',

    // Footer
    'footer.companyDesc': 'Membangun impian Anda dengan fondasi yang kuat, presisi teknik sipil tingkat tinggi, dan kualitas tanpa kompromi.',
    'footer.brandTagline': 'Membangun Keunggulan Mutu',
    'footer.quickLinks': 'Tautan Cepat',
    'footer.ourOffice': 'Kantor & Kontak',
    'footer.mapTitle': 'Lokasi Kantor',
    'footer.openMaps': 'Buka Peta ↗',
    'footer.rights': 'Hak Cipta Dilindungi.',

    // Floating Widget
    'widget.wa': 'WhatsApp Resmi',
    'widget.instagram': 'Instagram Resmi',
    'widget.telegram': 'Telegram Resmi'
  },
  EN: {
    // Navbar
    'nav.brandSubtitle': 'Engineering & Build',
    'nav.about': 'About Us',
    'nav.services': 'Services',
    'nav.projects': 'Projects',
    'nav.whyUs': 'Why Us',
    'nav.contact': 'Contact',
    'nav.searchPlaceholder': 'Search...',
    'nav.about.story': 'Our Story',
    'nav.about.vision': 'Vision & Mission',
    'nav.about.clients': 'Clients & Partners',
    'nav.services.residential': 'Residential & Villas',
    'nav.services.commercial': 'Commercial Buildings',
    'nav.services.infrastructure': 'Civil Infrastructure',
    'nav.services.fabrication': 'Steel Fabrication',
    'nav.projects.all': 'All Portfolio',
    'nav.projects.residential': 'Residential Projects',
    'nav.projects.commercial': 'Commercial Projects',
    'nav.projects.infrastructure': 'Infrastructure Projects',

    // Hero
    'hero.tag1': 'ARCHITECTURE & DESIGN',
    'hero.title1': 'Engineering the Future with Precision & Quality',
    'hero.sub1': 'Integrated modern architecture and luxury residential construction solutions built to international standards.',
    'hero.cta1': 'Explore Architecture',

    'hero.tag2': 'COMMERCIAL DEVELOPMENT',
    'hero.title2': 'Majestic Commercial & Corporate Development',
    'hero.sub2': 'High-value business hubs engineered with uncompromising safety, structural reliability, and timeline efficiency.',
    'hero.cta2': 'Explore Commercial Projects',

    'hero.tag3': 'INDUSTRIAL INFRASTRUCTURE',
    'hero.title3': 'Vital Infrastructure & Industrial Works',
    'hero.sub3': 'Industrial factories, logistics hubs, and strategic national infrastructure built to endure generations.',
    'hero.cta3': 'Our Industrial Capabilities',

    // About
    'about.badge': 'Company Profile',
    'about.title': 'Raya Konstruksi Jaya',
    'about.tabStory': 'Our Story',
    'about.tabVision': 'Our Vision',
    'about.tabMission': 'Our Mission',
    'about.story': 'For over 15 years, Raya Konstruksi Jaya has been leading the national construction industry. We combine cutting-edge technology, premium materials, and world-class architectural expertise to build structures of exceptional aesthetics and strength.',
    'about.story2': 'Founded with high professional integrity, we are committed to guiding every phase of construction from preliminary architectural blueprints to key handover.',
    'about.visionTitle': 'Pioneering Sustainable Horizons',
    'about.visionDesc': 'To be the forefront, innovative, and eco-conscious general contractor recognized as a cornerstone of modern infrastructure.',
    'about.mission1': 'Deliver superior workmanship with strict priority on Occupational Safety and Health (K3) across all job sites.',
    'about.mission2': 'Uphold exact structural precision and refined architectural elegance in every single build.',
    'about.mission3': 'Ensure budgetary transparency and consistent on-schedule delivery milestones.',

    // Why Us
    'whyUs.badge': 'Our Strengths',
    'whyUs.title': 'Why Choose Us?',
    'whyUs.desc': 'We do not simply assemble concrete and steel. We create livable, sustainable spaces that balance structural resilience, rigorous safety, and architectural elegance.',
    'whyUs.r1.title': 'Architectural Excellence',
    'whyUs.r1.desc': 'We integrate core structural fortitude with timeless, sophisticated contemporary architectural design.',
    'whyUs.r2.title': 'Premium Grade Materials',
    'whyUs.r2.desc': 'Every material is rigorously tested and selected to guarantee enduring structural performance across generations.',
    'whyUs.r3.title': 'Seamless Project Timelines',
    'whyUs.r3.desc': 'Transparent project management combined with rigorous scheduling ensures dependable milestone completion and handover.',

    // Services
    'services.badge': 'Services Overview',
    'services.title': 'Our Areas of Expertise',
    'services.desc': 'Providing comprehensive construction services from architectural conception and civil engineering to interior fit-out.',
    'services.btnConsult': 'Consultation',
    'services.s1.title': 'Residential Design',
    'services.s1.desc': 'Custom luxury home building, modern villas, and residential developments engineered with exceptional craftsmanship.',
    'services.s2.title': 'Commercial Spaces',
    'services.s2.desc': 'High-rise office buildings, retail shopping complexes, and mixed-use spaces optimized for aesthetics and traffic flow.',
    'services.s3.title': 'Industrial Development',
    'services.s3.desc': 'Large-scale logistic distribution warehouses, manufacturing plants, and industrial complexes built to international industrial codes.',
    'services.s4.title': 'Infrastructure Works',
    'services.s4.desc': 'Critical public and private civil infrastructure including arterial highways, bridges, and municipal works.',
    'services.s5.title': 'Steel Fabrication & Workshop',
    'services.s5.desc': 'Heavy structural steel framing, engineered lightweight roof trusses, and precision steel elements for civil & industrial projects.',
    'services.s6.title': 'Retrofit & Modernization',
    'services.s6.desc': 'Complete architectural renovation, structural reinforcement, and modern facade rejuvenation for legacy buildings.',

    // Reviews & Clients
    'reviews.badge': 'Client Endorsements',
    'reviews.title': 'Client Trust & Testimonials',
    'reviews.desc': 'Real testimonials and confidence from corporate partners, architects, and project owners who trust Raya Konstruksi Jaya.',
    'reviews.btnWrite': 'Write a Review',
    'reviews.trustedBy': 'Trusted By Leading Industry Enterprises:',

    // Review Modal Form
    'modal.title': 'Client Feedback Review',
    'modal.subtitle': 'Share Your Feedback',
    'modal.desc': 'Your input directly helps uphold and elevate the service quality of Raya Konstruksi Jaya.',
    'modal.nameLabel': 'Full Name *',
    'modal.companyLabel': 'Company / Affiliation',
    'modal.roleLabel': 'Role / Title',
    'modal.typeLabel': 'Project Category',
    'modal.ratingLabel': 'Project Rating',
    'modal.reviewLabel': 'Your Review & Experience *',
    'modal.submitBtn': 'Submit Review Now',
    'modal.submitting': 'Submitting...',

    // Projects
    'projects.badge': 'Portfolio Projects',
    'projects.title': 'Architectural Masterpieces',
    'projects.desc': 'Explore our portfolio of high-precision architectural and civil construction achievements nationwide.',
    'projects.filterAll': 'All',
    'projects.filterResidential': 'Residential',
    'projects.filterCommercial': 'Commercial',
    'projects.filterInfrastructure': 'Infrastructure',
    'projects.detailsHeader': 'Project Details',
    'projects.client': 'Client',
    'projects.budget': 'Project Value',
    'projects.location': 'Location',
    'projects.duration': 'Duration',
    'projects.inquire': 'Inquire About This Project',
    'projects.prev': 'Previous',
    'projects.next': 'Next',

    // Contact
    'contact.badge': 'Get In Touch',
    'contact.title': 'Ready to Start Your Project?',
    'contact.desc': 'Discuss your construction and design ideas with our seasoned estimator engineers directly on WhatsApp or Email.',
    'contact.btnWa': 'Start WhatsApp Consultation',
    'contact.btnEmail': 'Send Inquiry Email',

    // Footer
    'footer.companyDesc': 'Building your visions with solid foundations, high-precision engineering, and uncompromised quality.',
    'footer.brandTagline': 'Building Excellence',
    'footer.quickLinks': 'Quick Links',
    'footer.ourOffice': 'Office & Contact',
    'footer.mapTitle': 'Office Location',
    'footer.openMaps': 'Open Maps ↗',
    'footer.rights': 'All Rights Reserved.',

    // Floating Widget
    'widget.wa': 'WhatsApp Chat',
    'widget.instagram': 'Official Instagram',
    'widget.telegram': 'Official Telegram'
  }
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'ID',
  setLang: () => {},
  toggleLang: () => {},
  t: (key: string) => key,
  translateText: (text: string) => text
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('site_lang');
    return saved === 'EN' ? 'EN' : 'ID';
  });

  // Translation cache persisted in localStorage
  const [translationCache, setTranslationCache] = useState<Record<string, Record<string, string>>>(() => {
    try {
      const saved = localStorage.getItem('site_auto_translations');
      return saved ? JSON.parse(saved) : { ID_to_EN: {}, EN_to_ID: {} };
    } catch {
      return { ID_to_EN: {}, EN_to_ID: {} };
    }
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('site_lang', newLang);
  };

  const toggleLang = () => {
    setLang(lang === 'ID' ? 'EN' : 'ID');
  };

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations['ID']?.[key] || key;
  };

  // Auto-translate dynamic text (from database/admin)
  const translateText = (text: string): string => {
    if (!text || typeof text !== 'string') return text;
    const trimmed = text.trim();
    if (!trimmed) return text;

    // If Indonesian is active, return original text as Indonesian is native
    if (lang === 'ID') {
      const fromEn = translationCache.EN_to_ID?.[trimmed];
      return fromEn || text;
    }

    // In English mode, check cache first
    const cached = translationCache.ID_to_EN?.[trimmed];
    if (cached) return cached;

    // Trigger async background translation to translate and populate cache
    if (!translationCache.ID_to_EN?.[trimmed]) {
      const pair = 'id|en';
      fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=${pair}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.responseData && data.responseData.translatedText) {
            const translated = data.responseData.translatedText;
            setTranslationCache(prev => {
              const updated = {
                ...prev,
                ID_to_EN: {
                  ...prev.ID_to_EN,
                  [trimmed]: translated
                }
              };
              try {
                localStorage.setItem('site_auto_translations', JSON.stringify(updated));
              } catch (e) {}
              return updated;
            });
          }
        })
        .catch(() => {});
    }

    return text;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, translateText }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
