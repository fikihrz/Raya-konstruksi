import React, { createContext, useContext, useState, useRef } from 'react';

export type Language = 'ID' | 'EN';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: string) => string;
  translateText: (text: string) => string;
  resolveDynamicText: (dbValue: string | undefined, fallbackKey: string) => string;
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
    'nav.about.profile': 'Profil Perusahaan',
    'nav.about.whyUs': 'Keunggulan Kami',
    'nav.about.clients': 'Klien & Testimoni',
    'nav.services.residential': 'Residensial & Vila',
    'nav.services.commercial': 'Komersial & Gedung',
    'nav.services.infrastructure': 'Infrastruktur Sipil',
    'nav.services.fabrication': 'Fabrikasi Baja',
    'nav.projects.all': 'Semua Portofolio',
    'nav.projects.residential': 'Proyek Residensial',
    'nav.projects.commercial': 'Proyek Komersial',
    'nav.projects.industrial': 'Proyek Industri',
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
    'about.heading': 'Tentang Kami',
    'about.title': 'Raya Konstruksi Jaya',
    'about.f1.title': 'Presisi Arsitektur',
    'about.f1.desc': 'Perencanaan matang dari gambar kerja hingga finishing.',
    'about.f2.title': 'Tepat Waktu',
    'about.f2.desc': 'Manajemen jadwal terukur dan laporan progres jelas.',
    'about.f3.title': 'Standar Mutu & K3',
    'about.f3.desc': 'Prioritas keselamatan kerja dan material teruji.',
    'about.f4.title': 'Konstruksi Kokoh',
    'about.f4.desc': 'Bangunan berdaya tahan tinggi untuk investasi jangka panjang.',
    'about.cta': 'Jelajahi Layanan',

    // Why Us
    'whyUs.badge': 'Keunggulan Kami',
    'whyUs.title': 'Kenapa Memilih Kami?',
    'whyUs.desc': 'Kami tidak sekadar menyusun beton dan besi. Kami merancang ruang hidup dan bisnis yang mengutamakan keamanan tinggi, presisi struktural, serta keselarasan estetika.',

    // Services
    'services.badge': 'Ikhtisar Layanan',
    'services.title': 'Bidang Keahlian Kami',
    'services.desc': 'Menyediakan layanan penuh mulai dari konsep perencanaan arsitektur, pelaksanaan konstruksi sipil, hingga tahap finishing interior.',
    'services.btnConsult': 'Konsultasi Layanan',

    // Reviews & Clients
    'reviews.badge': 'Testimoni Klien',
    'reviews.title': 'Dipercaya Oleh Klien & Mitra Industri',
    'reviews.desc': 'Pengalaman nyata para pemilik proyek dan mitra usaha yang bekerja sama dengan kami.',
    'reviews.btnWrite': 'Tulis Ulasan',
    'reviews.trustedBy': 'Dipercaya Oleh Berbagai Perusahaan Terkemuka',
    'reviews.filterAll': 'Semua',
    'reviews.filterAllRating': 'Semua Rating',
    'reviews.searchPlaceholder': 'Cari ulasan atau nama klien...',
    'reviews.empty': 'Belum ada ulasan yang sesuai dengan filter pencarian.',
    'reviews.prev': 'Sebelumnya',
    'reviews.next': 'Selanjutnya',
    'reviews.page': 'Halaman',

    // Review Modal Form
    'modal.title': 'Tulis Ulasan Klien',
    'modal.subtitle': 'Beri Tanggapan Anda',
    'modal.desc': 'Ulasan Anda sangat berarti bagi pengembangan mutu layanan kami.',
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
    'projects.filterIndustrial': 'Industri',
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

    // Consultation Modal
    'consult.title': 'Konsultasi Layanan',
    'consult.subtitle': 'Pilih metode untuk menghubungi tim kami',
    'consult.forService': 'Layanan:',
    'consult.viaWa': 'Chat WhatsApp',
    'consult.viaEmail': 'Kirim Email',
    'consult.waTemplate': 'Halo {company}, saya tertarik dengan layanan *{service}*. Saya ingin berkonsultasi mengenai kebutuhan proyek saya. Bisakah kita berdiskusi lebih lanjut?',
    'consult.emailSubject': 'Konsultasi Layanan {service} - {company}',
    'consult.emailBody': 'Yth. Tim {company},\n\nSaya tertarik dengan layanan {service} yang ditawarkan.\nSaya ingin berkonsultasi mengenai kebutuhan proyek saya sebagai berikut:\n\n- Jenis Proyek: \n- Lokasi: \n- Estimasi Anggaran: \n- Timeline: \n\nMohon informasi lebih lanjut mengenai layanan ini.\n\nTerima kasih.',

    // Floating Widget
    'widget.wa': 'WhatsApp',
    'widget.instagram': 'Instagram',
    'widget.tiktok': 'TikTok'
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
    'nav.about.profile': 'Company Profile',
    'nav.about.whyUs': 'Our Strengths',
    'nav.about.clients': 'Clients & Reviews',
    'nav.services.residential': 'Residential & Villas',
    'nav.services.commercial': 'Commercial Buildings',
    'nav.services.infrastructure': 'Civil Infrastructure',
    'nav.services.fabrication': 'Steel Fabrication',
    'nav.projects.all': 'All Portfolio',
    'nav.projects.residential': 'Residential Projects',
    'nav.projects.commercial': 'Commercial Projects',
    'nav.projects.industrial': 'Industrial Projects',
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
    'about.heading': 'About Us',
    'about.title': 'Raya Konstruksi Jaya',
    'about.f1.title': 'Architectural Precision',
    'about.f1.desc': 'Integrated planning from blueprint to final structure.',
    'about.f2.title': 'On-Schedule Delivery',
    'about.f2.desc': 'Disciplined timeline control with transparent reporting.',
    'about.f3.title': 'Safety & K3 Standard',
    'about.f3.desc': 'Certified workplace safety across every project site.',
    'about.f4.title': 'Long-Term Value',
    'about.f4.desc': 'Built with structural reliability across generations.',
    'about.cta': 'Explore Services',

    // Why Us
    'whyUs.badge': 'Our Strengths',
    'whyUs.title': 'Why Choose Us?',
    'whyUs.desc': 'We do not simply assemble concrete and steel. We create livable, sustainable spaces that balance structural resilience, rigorous safety, and architectural elegance.',

    // Services
    'services.badge': 'Services Overview',
    'services.title': 'Our Areas of Expertise',
    'services.desc': 'Providing comprehensive construction services from architectural conception and civil engineering to interior fit-out.',
    'services.btnConsult': 'Consultation',

    // Reviews & Clients
    'reviews.badge': 'Client Testimonials',
    'reviews.title': 'Trusted By Clients & Industry Partners',
    'reviews.desc': 'Real feedback from project owners and corporate partners who trust our construction standards.',
    'reviews.btnWrite': 'Write a Review',
    'reviews.trustedBy': 'Trusted By Leading Enterprises',
    'reviews.filterAll': 'All',
    'reviews.filterAllRating': 'All Ratings',
    'reviews.searchPlaceholder': 'Search reviews or client name...',
    'reviews.empty': 'No reviews match your filter criteria.',
    'reviews.prev': 'Previous',
    'reviews.next': 'Next',
    'reviews.page': 'Page',

    // Review Modal Form
    'modal.title': 'Client Feedback Review',
    'modal.subtitle': 'Share Your Feedback',
    'modal.desc': 'Your input helps uphold and elevate our construction service quality.',
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
    'projects.filterIndustrial': 'Industrial',
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

    // Consultation Modal
    'consult.title': 'Service Consultation',
    'consult.subtitle': 'Choose how to contact our team',
    'consult.forService': 'Service:',
    'consult.viaWa': 'WhatsApp Chat',
    'consult.viaEmail': 'Send Email',
    'consult.waTemplate': 'Hello {company}, I am interested in your *{service}* service. I would like to consult regarding my project needs. Could we discuss further?',
    'consult.emailSubject': '{service} Service Consultation - {company}',
    'consult.emailBody': 'Dear {company} Team,\n\nI am interested in the {service} service offered.\nI would like to consult regarding my project needs as follows:\n\n- Project Type: \n- Location: \n- Estimated Budget: \n- Timeline: \n\nPlease provide more information about this service.\n\nThank you.',

    // Floating Widget
    'widget.wa': 'WhatsApp Chat',
    'widget.instagram': 'Official Instagram',
    'widget.tiktok': 'Official TikTok'
  }
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'ID',
  setLang: () => {},
  toggleLang: () => {},
  t: (key: string) => key,
  translateText: (text: string) => text,
  resolveDynamicText: (dbValue: string | undefined, fallbackKey: string) => dbValue || fallbackKey
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('site_lang');
    return saved === 'EN' ? 'EN' : 'ID';
  });

  const [translationCache, setTranslationCache] = useState<Record<string, Record<string, string>>>(() => {
    try {
      const saved = localStorage.getItem('site_auto_translations');
      if (!saved) return { ID_to_EN: {}, EN_to_ID: {} };
      const parsed = JSON.parse(saved);
      const cleanMap = (obj: Record<string, string> = {}) => {
        const res: Record<string, string> = {};
        for (const [k, v] of Object.entries(obj)) {
          if (typeof v === 'string' && !v.toUpperCase().includes('MYMEMORY WARNING') && !v.toUpperCase().includes('USAGELIMITS.PHP')) {
            res[k] = v;
          }
        }
        return res;
      };
      const cleaned = {
        ID_to_EN: cleanMap(parsed.ID_to_EN),
        EN_to_ID: cleanMap(parsed.EN_to_ID)
      };
      localStorage.setItem('site_auto_translations', JSON.stringify(cleaned));
      return cleaned;
    } catch {
      return { ID_to_EN: {}, EN_to_ID: {} };
    }
  });

  const inFlightRef = useRef<Set<string>>(new Set());

  const saveTranslation = (key: string, translated: string) => {
    if (!translated || translated.toUpperCase().includes('MYMEMORY WARNING') || translated.toUpperCase().includes('USAGELIMITS.PHP')) {
      return;
    }
    setTranslationCache(prev => {
      const updated = {
        ...prev,
        ID_to_EN: {
          ...prev.ID_to_EN,
          [key]: translated
        }
      };
      try {
        localStorage.setItem('site_auto_translations', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

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

  const translateText = (text: string): string => {
    if (!text || typeof text !== 'string') return text;
    const trimmed = text.trim();
    if (!trimmed) return text;

    if (lang === 'ID') {
      const fromEn = translationCache.EN_to_ID?.[trimmed];
      return fromEn || text;
    }

    const cached = translationCache.ID_to_EN?.[trimmed];
    if (cached && !cached.toUpperCase().includes('MYMEMORY WARNING')) {
      return cached;
    }

    if (!inFlightRef.current.has(trimmed)) {
      inFlightRef.current.add(trimmed);
      fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=id&tl=en&dt=t&q=${encodeURIComponent(trimmed)}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && Array.isArray(data[0])) {
            const translated = data[0].map((seg: any) => seg?.[0] || '').join('').trim();
            if (translated) {
              saveTranslation(trimmed, translated);
              return;
            }
          }
          throw new Error('Fallback to MyMemory');
        })
        .catch(() => {
          fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=id|en`)
            .then(res => res.json())
            .then(data => {
              const translated = data?.responseData?.translatedText;
              const isValid = data?.responseStatus === 200 && !data?.quotaFinished && typeof translated === 'string' && !translated.toUpperCase().includes('MYMEMORY WARNING') && !translated.toUpperCase().includes('USAGELIMITS.PHP');
              if (isValid) {
                saveTranslation(trimmed, translated);
              }
            })
            .catch(() => {});
        });
    }

    return text;
  };

  // Sync admin-edited settings with curated fallback translations across ID & EN
  const resolveDynamicText = (dbValue: string | undefined, fallbackKey: string): string => {
    const trimmed = dbValue?.trim();
    if (!trimmed) return t(fallbackKey);

    const idDefault = translations['ID'][fallbackKey];
    if (idDefault && trimmed.toLowerCase() === idDefault.toLowerCase()) {
      return t(fallbackKey);
    }

    return lang === 'EN' ? translateText(trimmed) : trimmed;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, translateText, resolveDynamicText }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
