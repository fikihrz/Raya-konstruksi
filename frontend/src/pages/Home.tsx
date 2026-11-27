import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { FiArrowRight, FiMail, FiX, FiCalendar, FiMap, FiChevronLeft, FiChevronRight, FiPause, FiPlay, FiStar, FiEdit3, FiMaximize, FiMinimize, FiVolume2, FiVolumeX, FiSearch, FiShield, FiCompass, FiClock, FiLayers } from 'react-icons/fi';
import { FaWhatsapp, FaStar } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import { EmailModal } from '../components/EmailModal';

const Home = () => {
  const { t, lang, translateText, resolveDynamicText } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const [services, setServices] = useState<any[]>([]);
  const [reasons, setReasons] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://backend-three-beta-90.vercel.app';

  // Portfolio Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    const el = document.getElementById('projects');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getAssetUrl = (src?: string, fallback = 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?w=800&q=80') => {
    if (!src || !src.trim()) return fallback;
    const clean = src.trim();
    if (clean.startsWith('http') || clean.startsWith('data:')) return clean;
    if (clean.startsWith('/uploads')) return `${API_BASE}${clean}`;
    return clean;
  };

  const getAboutVideoSrc = () => {
    const v = settings.aboutVideo?.trim();
    if (!v) return '/construction-video.mp4';
    if (v.startsWith('data:video') || /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(v) || v.startsWith('/') || v.startsWith('http')) {
      return v;
    }
    return '/construction-video.mp4';
  };

  // Review Form & Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');

  // Review Filter & Carousel Pagination State (3 cards per page so cards never stack downward)
  const [reviewCategoryFilter, setReviewCategoryFilter] = useState('All');
  const [reviewRatingFilter, setReviewRatingFilter] = useState<number | 'All'>('All');
  const [reviewSearchQuery, setReviewSearchQuery] = useState('');
  const [reviewPage, setReviewPage] = useState(1);
  const reviewsPerPage = 3;

  const handleReviewPageChange = (newPage: number) => {
    setReviewPage(newPage);
  };

  // Consultation Modal State
  const [consultService, setConsultService] = useState<string | null>(null);
  
  // Email Modal State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailModalSubject, setEmailModalSubject] = useState('');
  const [emailModalBody, setEmailModalBody] = useState('');

  useEffect(() => {
    const handler = (e: any) => {
      if (e.detail?.subject) setEmailModalSubject(e.detail.subject);
      if (e.detail?.body) setEmailModalBody(e.detail.body);
      setIsEmailModalOpen(true);
    };
    window.addEventListener('open-email-modal', handler);
    return () => window.removeEventListener('open-email-modal', handler);
  }, []);
  const [newReview, setNewReview] = useState({
    name: '',
    company: '',
    role: '',
    projectType: 'Residensial',
    rating: 5,
    review: ''
  });

  // About Video Player State (YouTube-style Player with Fullscreen & Scrubber)
  const [isVideoFullscreen, setIsVideoFullscreen] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isVideoMini, setIsVideoMini] = useState(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsVideoFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const formatVideoTime = (seconds: number) => {
    if (isNaN(seconds) || seconds <= 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration || 1;
      setVideoCurrentTime(current);
      setVideoDuration(total);
      setVideoProgress((current / total) * 100);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (videoRef.current && videoDuration) {
      videoRef.current.currentTime = pos * videoDuration;
      setVideoCurrentTime(pos * videoDuration);
      setVideoProgress(pos * 100);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (videoContainerRef.current?.requestFullscreen) {
        videoContainerRef.current.requestFullscreen().catch(() => {
          openFullscreen();
        });
      } else {
        openFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const openFullscreen = () => {
    setIsVideoFullscreen(true);
    setIsVideoMini(false);
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      setTimeout(() => {
        if (fullscreenVideoRef.current) {
          fullscreenVideoRef.current.currentTime = currentTime;
          fullscreenVideoRef.current.muted = isVideoMuted;
          fullscreenVideoRef.current.play().catch(() => {});
        }
      }, 60);
    }
  };

  const closeFullscreen = () => {
    if (fullscreenVideoRef.current && videoRef.current) {
      videoRef.current.currentTime = fullscreenVideoRef.current.currentTime;
    }
    setIsVideoFullscreen(false);
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVideoFullscreen) {
        closeFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVideoFullscreen]);

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsVideoPlaying(true);
      } else {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  const toggleVideoMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsVideoMuted(videoRef.current.muted);
    }
  };

  // Helper to extract YouTube video ID if YouTube link is used
  const getYouTubeEmbedId = (url?: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  useEffect(() => {
    fetch(`${API_BASE}/api/data`)
      .then(res => res.json())
      .then(data => {
        setServices(data.services || []);
        setReasons(data.reasons || []);
        setProjects(data.projects || []);
        setClients(data.clients || []);
        setReviews(data.reviews || []);
        setSettings(data.settings || {});
        setLoading(false);
        window.dispatchEvent(new CustomEvent('app-data-ready'));
      })
      .catch(err => {
        console.error("Failed to fetch data:", err);
        setLoading(false);
        window.dispatchEvent(new CustomEvent('app-data-ready'));
      });
  }, []);

  // Hero Carousel Auto-Play Timer
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const [searchQuery, setSearchQuery] = useState('');

  // Listen to search and project category filter events from Navbar
  useEffect(() => {
    const handleSearchEvent = (e: any) => {
      const q = e.detail || '';
      setSearchQuery(q);
      if (q) {
        setActiveCategory('All');
        setCurrentPage(1);
      }
    };

    const handleProjectFilterEvent = (e: any) => {
      const cat = e.detail || 'All';
      setActiveCategory(cat);
      setCurrentPage(1);
      setSearchQuery('');
    };

    window.addEventListener('site-search', handleSearchEvent);
    window.addEventListener('project-filter', handleProjectFilterEvent);
    return () => {
      window.removeEventListener('site-search', handleSearchEvent);
      window.removeEventListener('project-filter', handleProjectFilterEvent);
    };
  }, []);

  const filteredProjects = projects.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    if (!matchesCategory) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const titleMatch = (p.title || '').toLowerCase().includes(q);
    const descMatch = (p.desc || p.fullDesc || '').toLowerCase().includes(q);
    const locMatch = (p.location || '').toLowerCase().includes(q);
    const clientMatch = (p.client || '').toLowerCase().includes(q);
    return titleMatch || descMatch || locMatch || clientMatch;
  });

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center bg-secondary text-white font-bold text-2xl">Loading...</div>;
  }

  return (
    <div>
      {/* === KIEWIT-STYLE HERO CAROUSEL === */}
      <section className="relative w-full overflow-hidden bg-black h-screen min-h-[520px] sm:min-h-[620px]">
        
        {/* Slides Definition */}
        {(() => {
          const slides = [
            {
              id: 1,
              tag: resolveDynamicText(settings.heroTag1, 'hero.tag1'),
              title: resolveDynamicText(settings.heroTitle, 'hero.title1'),
              subtitle: resolveDynamicText(settings.heroDesc, 'hero.sub1'),
              img: getAssetUrl(settings.heroImage, '/galery/WhatsApp Image 2026-07-01 at 23.38.36.jpeg'),
              cta: t('hero.cta1')
            },
            {
              id: 2,
              tag: resolveDynamicText(settings.heroTag2, 'hero.tag2'),
              title: resolveDynamicText(settings.heroTitle2, 'hero.title2'),
              subtitle: resolveDynamicText(settings.heroDesc2, 'hero.sub2'),
              img: getAssetUrl(settings.heroImage2, '/galery/WhatsApp Image 2026-07-01 at 23.38.36 (2).jpeg'),
              cta: t('hero.cta2')
            },
            {
              id: 3,
              tag: resolveDynamicText(settings.heroTag3, 'hero.tag3'),
              title: resolveDynamicText(settings.heroTitle3, 'hero.title3'),
              subtitle: resolveDynamicText(settings.heroDesc3, 'hero.sub3'),
              img: getAssetUrl(settings.heroImage3, '/galery/WhatsApp Image 2026-07-01 at 23.38.37.jpeg'),
              cta: t('hero.cta3')
            }
          ];

          const current = slides[currentSlide];

          return (
            <>
              {/* Full-Screen Background Images with Cinematic Fade */}
              <div className="absolute inset-0 z-0">
                <AnimatePresence initial={false} mode="sync">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <img
                      src={current.img}
                      alt={current.title}
                      fetchPriority="high"
                      decoding="sync"
                      className="w-full h-full object-cover filter brightness-[0.9] contrast-[1.05]"
                    />
                    {/* Soft gradient overlays to keep text readable while making background brighter */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom-Left Content (Kiewit Style) */}
              <div className="absolute bottom-0 left-0 right-0 z-10 pb-16 sm:pb-24 px-4 sm:px-12 lg:px-20 max-w-5xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`content-${currentSlide}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                  >
                    {/* Category Tag with Animated Amber Underline */}
                    <div className="inline-block mb-3.5">
                      <div className="flex flex-col items-start">
                        <span className="text-white text-xs sm:text-sm font-extrabold tracking-[0.22em] uppercase pb-1">
                          {current.tag}
                        </span>
                        {/* Animated loading underline for the tag - Corporate Blue */}
                        <div className="w-full h-[2.5px] bg-white/20 rounded-full overflow-hidden relative">
                          <motion.div
                            key={`tag-line-${currentSlide}`}
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                            className="h-full bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.9)]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Main Headline (Poppins Typography) */}
                    <h1
                      className="text-3xl sm:text-5xl lg:text-[64px] font-black text-white leading-[1.08] tracking-tight mb-4 drop-shadow-2xl"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {current.title}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-slate-200 text-sm sm:text-base lg:text-lg font-normal leading-relaxed mb-6 max-w-2xl drop-shadow">
                      {current.subtitle}
                    </p>

                    {/* Button: Styled Corporate Blue CTA Button */}
                    <div className="pt-1">
                      <a
                        href="#contact"
                        className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base tracking-wide shadow-xl shadow-blue-600/35 hover:scale-105 active:scale-95 transition-all select-none group"
                      >
                        <span>{current.cta}</span>
                        <span className="text-white text-xl font-black group-hover:translate-x-1.5 transition-transform leading-none">
                          →
                        </span>
                      </a>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Subtle Edge Chevron Navigation */}
              <button
                onClick={() => setCurrentSlide(prev => (prev === 0 ? 2 : prev - 1))}
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 text-white/30 hover:text-white transition-colors focus:outline-none p-2"
                aria-label="Previous Banner"
              >
                <FiChevronLeft size={34} />
              </button>

              <button
                onClick={() => setCurrentSlide(prev => (prev + 1) % 3)}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 text-white/30 hover:text-white transition-colors focus:outline-none p-2"
                aria-label="Next Banner"
              >
                <FiChevronRight size={34} />
              </button>

              {/* Bottom-Center Slide Indicator (Blue Capsule with Loading Bar Animation) */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
                {slides.map((_, idx) => {
                  const isActive = currentSlide === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className="group py-2 focus:outline-none cursor-pointer flex items-center"
                      aria-label={`Slide ${idx + 1}`}
                    >
                      {isActive ? (
                        /* Active: Elongated bar with animated blue loading fill */
                        <div className="w-10 sm:w-14 h-1.5 bg-white/25 rounded-full overflow-hidden relative shadow-sm">
                          <motion.div
                            key={`progress-${currentSlide}-${isPlaying}`}
                            initial={{ width: "0%" }}
                            animate={{ width: isPlaying ? "100%" : "0%" }}
                            transition={{ duration: 6, ease: "linear" }}
                            className="h-full bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.9)]"
                          />
                        </div>
                      ) : (
                        /* Inactive: Clean dot */
                        <div className="w-2.5 h-1.5 bg-white/40 group-hover:bg-white/80 rounded-full transition-all" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Bottom-Right Play/Pause Toggle Button (Kiewit Signature) */}
              <button
                onClick={() => setIsPlaying(prev => !prev)}
                className="absolute bottom-6 right-6 sm:right-10 z-20 h-10 w-10 rounded-full border border-white/50 hover:border-white text-white flex items-center justify-center hover:bg-white/10 transition-colors focus:outline-none"
                aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
                title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
              >
                {isPlaying ? <FiPause size={15} /> : <FiPlay size={15} className="ml-0.5" />}
              </button>
            </>
          );
        })()}
      </section>

      {/* About Section - Clean Two-Column Corporate Layout */}
      <section id="about" className="bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Panel: Heading + Video Showcase */}
          <div className="lg:col-span-6 px-6 sm:px-10 lg:px-12 py-16 sm:py-20 space-y-6 flex flex-col justify-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {resolveDynamicText(settings.aboutHeading, 'about.heading')}
            </h2>

            {getYouTubeEmbedId(settings.aboutVideo) ? (
              <div className="relative rounded-md overflow-hidden shadow-md bg-slate-950 aspect-[16/10] sm:aspect-[16/9]">
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeEmbedId(settings.aboutVideo)}?autoplay=1&mute=1&loop=1&playlist=${getYouTubeEmbedId(settings.aboutVideo)}&controls=1&rel=0`}
                  title="Company Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            ) : (
              <div 
                ref={videoContainerRef}
                className="relative rounded-md overflow-hidden shadow-md bg-black aspect-[16/10] sm:aspect-[16/9] group select-none flex flex-col justify-between"
              >
                {/* HTML5 Loop Video */}
                <video
                  ref={videoRef}
                  src={getAboutVideoSrc()}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.endsWith('/construction-video.mp4')) {
                      target.src = '/construction-video.mp4';
                      target.play().catch(() => {});
                    }
                  }}
                  preload="metadata"
                  autoPlay
                  loop
                  muted={isVideoMuted}
                  playsInline
                  onTimeUpdate={handleTimeUpdate}
                  onClick={toggleVideoPlay}
                  className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                />

                {/* Subtle Cinematic Vignette / Gradient (Fade in on hover or pause) */}
                <div 
                  onClick={toggleVideoPlay}
                  className={`absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40 cursor-pointer transition-opacity duration-300 ${
                    !isVideoPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`} 
                />

                {/* Top Controls Bar (Clean with Top-Right Mute Button, auto-hides when playing) */}
                <div className={`relative z-10 p-4 sm:p-5 flex items-center justify-end text-white transition-opacity duration-300 ${
                  !isVideoPlaying ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto'
                }`}>
                  <div className="flex items-center gap-2">
                    {/* Top Right Speaker / Mute Toggle */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleVideoMute();
                      }}
                      className="p-2 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white transition-all border border-white/15 hover:scale-105"
                      title={isVideoMuted ? (lang === 'EN' ? 'Unmute' : 'Aktifkan Suara') : (lang === 'EN' ? 'Mute' : 'Bisukan')}
                    >
                      {isVideoMuted ? <FiVolumeX size={16} /> : <FiVolume2 size={16} />}
                    </button>
                  </div>
                </div>

                {/* Center Big Play/Pause Button (Matching Screenshot Pause Circle) */}
                <div 
                  onClick={toggleVideoPlay}
                  className="relative z-10 flex-1 flex items-center justify-center cursor-pointer pointer-events-auto"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleVideoPlay();
                    }}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center border border-white/25 shadow-2xl transition-all duration-300 transform hover:scale-110 ${
                      isVideoPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100 scale-105 ring-4 ring-white/20'
                    }`}
                    title={isVideoPlaying ? 'Pause' : 'Play'}
                  >
                    {isVideoPlaying ? (
                      <FiPause size={24} className="text-white" />
                    ) : (
                      <FiPlay size={24} className="text-white ml-1" />
                    )}
                  </button>
                </div>

                {/* Bottom Bar: Timeline Scrubber & Controls (Auto-hidden when playing, appears on hover or pause) */}
                <div className={`relative z-10 px-4 pb-3 sm:px-5 sm:pb-4 space-y-2 bg-gradient-to-t from-black/95 via-black/80 to-transparent pt-6 transition-all duration-300 transform ${
                  !isVideoPlaying 
                    ? 'opacity-100 translate-y-0 pointer-events-auto' 
                    : 'opacity-0 translate-y-3 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto'
                }`}>
                  {/* Red Timeline Scrubber (YouTube Style with hover dot) */}
                  <div
                    onClick={handleSeek}
                    className="group/seek relative w-full h-1.5 hover:h-2.5 bg-white/25 hover:bg-white/35 rounded-full cursor-pointer transition-all flex items-center"
                    title={lang === 'EN' ? 'Seek Video' : 'Geser Durasi Video'}
                  >
                    {/* Played Track (Red fill like screenshot) */}
                    <div 
                      className="bg-red-600 h-full rounded-full relative transition-all"
                      style={{ width: `${videoProgress}%` }}
                    >
                      {/* Red Scrubber Dot at end of progress */}
                      <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3.5 h-3.5 bg-red-600 rounded-full shadow-md border-2 border-white transform scale-0 group-hover/seek:scale-100 transition-transform" />
                    </div>
                  </div>

                  {/* Controls Row: Time + Bottom Buttons + Fullscreen Toggle */}
                  <div className="flex items-center justify-between text-white text-xs pt-1">
                    <div className="flex items-center gap-3">
                      {/* Play/Pause bottom button */}
                      <button
                        type="button"
                        onClick={toggleVideoPlay}
                        className="p-1 hover:text-red-500 transition-colors"
                        title={isVideoPlaying ? 'Pause' : 'Play'}
                        aria-label={isVideoPlaying ? 'Pause video' : 'Play video'}
                      >
                        {isVideoPlaying ? <FiPause size={16} /> : <FiPlay size={16} />}
                      </button>

                      {/* Time display: current / total (e.g. 0:01 / 0:48 like screenshot) */}
                      <span className="font-mono text-[11px] sm:text-xs text-white/90 select-none">
                        {formatVideoTime(videoCurrentTime)} / {formatVideoTime(videoDuration)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Mode Mini Player Floating */}
                      <button
                        type="button"
                        onClick={() => setIsVideoMini(true)}
                        className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white/90 text-[11px] font-medium transition-colors"
                        title={lang === 'EN' ? 'Mini Player' : 'Mode Kecil Melayang'}
                        aria-label="Mode Mini Player"
                      >
                        <FiMinimize size={12} />
                        <span>{lang === 'EN' ? 'Mini' : 'Kecil'}</span>
                      </button>

                      {/* Fullscreen / Minimize Toggle Button (The 4-corner expand/contract icon from screenshot) */}
                      <button
                        type="button"
                        onClick={toggleFullscreen}
                        className="p-1.5 hover:text-red-500 rounded transition-all hover:scale-110 text-white"
                        title={isVideoFullscreen ? (lang === 'EN' ? 'Exit Full Screen' : 'Perkecil (Keluar Layar Penuh)') : (lang === 'EN' ? 'Full Screen' : 'Layar Penuh')}
                        aria-label={isVideoFullscreen ? 'Keluar layar penuh' : 'Layar penuh'}
                      >
                        {isVideoFullscreen ? (
                          <FiMinimize size={18} className="text-white hover:text-red-400" />
                        ) : (
                          <FiMaximize size={18} className="text-white hover:text-red-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel: Concise 2x2 Expertise Grid + CTA */}
          <div className="lg:col-span-6 bg-white px-6 sm:px-10 lg:px-12 py-16 sm:py-20 flex flex-col justify-center space-y-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {resolveDynamicText(settings.aboutTitle, 'about.title')}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-7">
              {[
                {
                  icon: <FiCompass size={26} strokeWidth={1.6} />,
                  title: resolveDynamicText(settings.aboutFeature1Title, 'about.f1.title'),
                  desc: resolveDynamicText(settings.aboutFeature1Desc, 'about.f1.desc')
                },
                {
                  icon: <FiClock size={26} strokeWidth={1.6} />,
                  title: resolveDynamicText(settings.aboutFeature2Title, 'about.f2.title'),
                  desc: resolveDynamicText(settings.aboutFeature2Desc, 'about.f2.desc')
                },
                {
                  icon: <FiShield size={26} strokeWidth={1.6} />,
                  title: resolveDynamicText(settings.aboutFeature3Title, 'about.f3.title'),
                  desc: resolveDynamicText(settings.aboutFeature3Desc, 'about.f3.desc')
                },
                {
                  icon: <FiLayers size={26} strokeWidth={1.6} />,
                  title: resolveDynamicText(settings.aboutFeature4Title, 'about.f4.title'),
                  desc: resolveDynamicText(settings.aboutFeature4Desc, 'about.f4.desc')
                }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-lg border border-blue-200 bg-blue-50/50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <a
                href="#services"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
              >
                {resolveDynamicText(settings.aboutCtaText, 'about.cta')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Kenapa Memilih Kami Section */}
      <section id="why-us" className="py-16 sm:py-24 bg-slate-900 px-4 sm:px-8 relative overflow-hidden scroll-mt-20">
        {/* Abstract background blobs for premium feel */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-4 mb-16">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold uppercase tracking-widest text-[10px]">
              {t('whyUs.badge')}
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
              {resolveDynamicText(settings.whyTitle, 'whyUs.title')}
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed">
              {resolveDynamicText(settings.whyDesc, 'whyUs.desc')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-8">
            {reasons.map((reason, i) => {
              const rTitle = lang === 'EN' ? translateText(reason.title || '') : reason.title;
              const rDesc = lang === 'EN' ? translateText(reason.desc || '') : reason.desc;
              return (
                <div key={reason.id || i} className="group relative bg-slate-800/40 hover:bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 hover:border-blue-500/50 p-6 sm:p-8 rounded-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/20 flex flex-col items-center md:items-start text-center md:text-left space-y-4 sm:space-y-5">
                  <div className="w-14 h-14 flex-shrink-0 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/5 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                    <span className="text-xl font-black text-blue-400">{reason.number}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">{rTitle}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{rDesc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 2: Services (Layanan) - Horizontal Carousel Slider */}
      <section className="py-16 sm:py-24 bg-white px-4 sm:px-8">
        <div id="services" className="max-w-7xl mx-auto space-y-8 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col space-y-3 max-w-3xl">
              <span className="text-primary font-bold uppercase tracking-widest text-xs">{t('services.badge')}</span>
              <h2 className="text-3xl md:text-5xl font-black text-on-surface leading-tight">{resolveDynamicText(settings.servicesTitle, 'services.title')}</h2>
              <p className="text-on-surface-variant text-base leading-relaxed">
                {resolveDynamicText(settings.servicesDesc, 'services.desc')}
              </p>
            </div>

            {/* Navigation Arrows for Slider */}
            <div className="flex items-center gap-3 self-end md:self-auto">
              <button
                onClick={() => {
                  const el = document.getElementById('services-slider');
                  if (el) el.scrollBy({ left: -340, behavior: 'smooth' });
                }}
                className="h-11 w-11 rounded-full border border-slate-200 hover:border-blue-600 bg-white hover:bg-blue-600 text-slate-700 hover:text-white flex items-center justify-center transition-all shadow-sm active:scale-95 cursor-pointer"
                aria-label="Previous Service"
              >
                <FiChevronLeft size={22} />
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('services-slider');
                  if (el) el.scrollBy({ left: 340, behavior: 'smooth' });
                }}
                className="h-11 w-11 rounded-full border border-slate-200 hover:border-blue-600 bg-white hover:bg-blue-600 text-slate-700 hover:text-white flex items-center justify-center transition-all shadow-sm active:scale-95 cursor-pointer"
                aria-label="Next Service"
              >
                <FiChevronRight size={22} />
              </button>
            </div>
          </div>

          {/* Horizontal Scroll / Slider */}
          <div
            id="services-slider"
            className="flex gap-6 overflow-x-auto pb-6 pt-2 scroll-smooth no-scrollbar snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {services.map((service, idx) => {
              const sTitle = lang === 'EN' ? translateText(service.title || '') : service.title;
              const sDesc = lang === 'EN' ? translateText(service.desc || '') : service.desc;
              return (
                <div
                  key={service.id || idx}
                  className="group relative bg-white border border-blue-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between flex-shrink-0 w-[290px] sm:w-[320px] h-[390px] snap-start"
                >
                  <div className="h-48 overflow-hidden bg-blue-900 relative">
                    <img
                      src={getAssetUrl(service.img)}
                      alt={sTitle}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?w=800&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors duration-300">
                        {sTitle}
                      </h3>
                      <p className="text-xs text-on-surface-variant mt-2 leading-relaxed line-clamp-3">
                        {sDesc}
                      </p>
                    </div>
                    <button 
                      onClick={() => setConsultService(sTitle)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:gap-3 transition-all pt-4 cursor-pointer bg-transparent border-none"
                    >
                      {t('services.btnConsult')} <FiArrowRight />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects Section with Pagination (Placed right after Services) */}
      <section id="projects" className="py-16 sm:py-24 px-4 sm:px-8 bg-white border-t border-slate-100 scroll-mt-24">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-slate-200 pb-8">
            <div className="space-y-3">
              <span className="text-primary font-bold uppercase tracking-widest text-sm">{t('projects.badge')}</span>
              <h2 className="text-3xl md:text-5xl font-black text-on-surface">{resolveDynamicText(settings.projectsTitle, 'projects.title')}</h2>
              <p className="text-on-surface-variant text-sm max-w-xl">
                {resolveDynamicText(settings.projectsDesc, 'projects.desc')}
              </p>
              {searchQuery && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                  <span>{lang === 'EN' ? `Search: "${searchQuery}"` : `Pencarian: "${searchQuery}"`}</span>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      window.dispatchEvent(new CustomEvent('site-search', { detail: '' }));
                    }}
                    className="hover:text-red-600 font-bold ml-1 cursor-pointer"
                    title="Hapus filter pencarian"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2 md:self-end">
              {[
                { key: 'All', label: t('projects.filterAll') },
                { key: 'Residential', label: t('projects.filterResidential') },
                { key: 'Commercial', label: t('projects.filterCommercial') },
                { key: 'Industrial', label: t('projects.filterIndustrial') },
                { key: 'Infrastructure', label: t('projects.filterInfrastructure') }
              ].map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => {
                    setActiveCategory(cat.key);
                    handlePageChange(1);
                  }}
                  className={`px-5 py-2 rounded-full border transition-all text-xs font-bold cursor-pointer ${activeCategory === cat.key ? 'bg-primary border-primary text-white shadow-sm' : 'border-outline/50 hover:border-primary text-on-surface bg-white'}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clean Grid Display */}
          {(() => {
            const totalPages = Math.ceil(filteredProjects.length / projectsPerPage) || 1;
            const startIndex = (currentPage - 1) * projectsPerPage;
            const currentProjects = filteredProjects.slice(startIndex, startIndex + projectsPerPage);

            return (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 min-h-[320px] sm:min-h-[400px]">
                  {currentProjects.map((p, i) => (
                    <div
                      key={p.id || i}
                      onClick={() => setSelectedProject(p)}
                      className="group relative overflow-hidden rounded-2xl bg-slate-900 shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer h-[300px] sm:h-[380px] flex flex-col justify-end"
                    >
                      <img
                        className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-70 transition-all duration-700 bg-slate-800"
                        src={getAssetUrl(p.img)}
                        alt={p.title}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?w=800&q=80';
                        }}
                      />
                      <div className="relative z-10 p-7 bg-gradient-to-t from-black/95 via-black/50 to-transparent flex flex-col justify-end text-white">
                        <span className="text-blue-400 font-extrabold text-[11px] uppercase tracking-wider mb-1">
                          {(() => {
                            if (p.category === 'Residential') return lang === 'EN' ? 'Residential' : 'Residensial';
                            if (p.category === 'Commercial') return lang === 'EN' ? 'Commercial' : 'Komersial';
                            if (p.category === 'Industrial') return lang === 'EN' ? 'Industrial' : 'Industri';
                            if (p.category === 'Infrastructure') return lang === 'EN' ? 'Infrastructure' : 'Infrastruktur';
                            return p.category;
                          })()}
                        </span>
                        <h3 className="text-xl font-black leading-tight text-white mb-2 group-hover:text-blue-200 transition-colors">
                          {translateText(p.title)}
                        </h3>
                        <p className="text-xs text-slate-300 line-clamp-2 mb-3 leading-relaxed">
                          {translateText(p.desc || p.fullDesc || (lang === 'EN' ? 'High-precision construction built to the highest architectural standards.' : 'Pembangunan konstruksi dengan spesifikasi dan standar presisi terbaik.'))}
                        </p>
                        <div className="flex justify-between items-center text-[11px] text-white/70 border-t border-white/15 pt-3">
                          <span>{translateText(p.location)}</span>
                          <span>{p.year}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Portfolio Pagination Controls with Auto Scroll */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-8">
                    <button
                      onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
                    >
                      <FiChevronLeft size={16} />
                      <span>{t('projects.prev')}</span>
                    </button>

                    <div className="flex items-center gap-1.5 px-2">
                      {[...Array(totalPages)].map((_, pageIdx) => {
                        const pageNum = pageIdx + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-10 h-10 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm ${
                              currentPage === pageNum
                                ? 'bg-primary text-white scale-105 shadow-md shadow-blue-600/30'
                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
                    >
                      <span>{t('projects.next')}</span>
                      <FiChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </section>

      {/* Client Testimonials Carousel & Partner Strip */}
      <section id="clients" className="py-16 sm:py-24 bg-gradient-to-b from-blue-950 via-slate-950 to-blue-950 text-white overflow-hidden scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10 sm:space-y-12">

          {/* Centered Editorial Heading + CTA */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-block text-blue-400 font-bold uppercase tracking-[0.18em] text-[11px]">
              {t('reviews.badge')}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-[42px] font-extrabold text-white leading-[1.15] tracking-tight">
              {resolveDynamicText(settings.clientsTitle, 'reviews.title')}
            </h2>
            <p className="text-blue-200/75 text-sm sm:text-base leading-relaxed">
              {resolveDynamicText(settings.clientsDesc, 'reviews.desc')}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setReviewSuccessMsg('');
                  setReviewModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-lg shadow-blue-600/30 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <FiEdit3 size={14} />
                <span>{t('reviews.btnWrite')}</span>
              </button>
            </div>
          </div>

          {/* Review-Tailored Corporate Filter Bar */}
          <div className="max-w-5xl mx-auto bg-slate-900/75 border border-blue-800/50 p-2.5 sm:p-3 rounded-2xl backdrop-blur-md shadow-xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-0">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="text"
                value={reviewSearchQuery}
                onChange={(e) => {
                  setReviewSearchQuery(e.target.value);
                  setReviewPage(1);
                }}
                placeholder={lang === 'EN' ? 'Search client name or review...' : 'Cari nama klien atau isi ulasan...'}
                className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-blue-500 rounded-xl pl-10 pr-8 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none transition-colors"
              />
              {reviewSearchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setReviewSearchQuery('');
                    setReviewPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  aria-label="Reset Search"
                >
                  <FiX size={14} />
                </button>
              )}
            </div>

            {/* Right Controls: Rating Pills + Category Select */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2">
              {/* Rating Pills */}
              <div className="bg-slate-950/70 border border-slate-800 p-1 rounded-xl flex items-center gap-1 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => {
                    setReviewRatingFilter('All');
                    setReviewPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    reviewRatingFilter === 'All'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  {t('reviews.filterAllRating')}
                </button>
                {[5, 4, 3].map((stars) => (
                  <button
                    key={stars}
                    type="button"
                    onClick={() => {
                      setReviewRatingFilter(stars);
                      setReviewPage(1);
                    }}
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      reviewRatingFilter === stars
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                    }`}
                  >
                    <span>{stars}</span>
                    <FaStar size={11} className={reviewRatingFilter === stars ? 'text-amber-300' : 'text-amber-400'} />
                  </button>
                ))}
              </div>

              {/* Project Category Dropdown */}
              <select
                value={reviewCategoryFilter}
                onChange={(e) => {
                  setReviewCategoryFilter(e.target.value);
                  setReviewPage(1);
                }}
                aria-label="Filter Kategori Proyek"
                className="bg-slate-950/80 hover:bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer w-full sm:w-auto"
              >
                <option value="All">{lang === 'EN' ? 'All Project Types' : 'Semua Jenis Proyek'}</option>
                <option value="Residensial">{lang === 'EN' ? 'Residential' : 'Residensial'}</option>
                <option value="Komersial">{lang === 'EN' ? 'Commercial' : 'Komersial'}</option>
                <option value="Industri">{lang === 'EN' ? 'Industrial' : 'Industri'}</option>
                <option value="Infrastruktur">{lang === 'EN' ? 'Infrastructure' : 'Infrastruktur'}</option>
                <option value="Renovasi">{lang === 'EN' ? 'Renovation' : 'Renovasi'}</option>
              </select>

              {(reviewCategoryFilter !== 'All' || reviewRatingFilter !== 'All' || reviewSearchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setReviewCategoryFilter('All');
                    setReviewRatingFilter('All');
                    setReviewSearchQuery('');
                    setReviewPage(1);
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-blue-300 hover:text-white hover:bg-blue-600/30 border border-blue-500/30 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* 3-Card Paged Showcase Carousel */}
          {(() => {
            const filteredReviews = reviews.filter((rev) => {
              const matchesCat = reviewCategoryFilter === 'All' ||
                (rev.projectType && rev.projectType.toLowerCase().includes(reviewCategoryFilter.toLowerCase()));

              const matchesRating = reviewRatingFilter === 'All' || (Number(rev.rating) || 5) === reviewRatingFilter;

              const q = reviewSearchQuery.toLowerCase().trim();
              const matchesSearch = !q ||
                (rev.name && rev.name.toLowerCase().includes(q)) ||
                (rev.company && rev.company.toLowerCase().includes(q)) ||
                (rev.role && rev.role.toLowerCase().includes(q)) ||
                (rev.review && rev.review.toLowerCase().includes(q)) ||
                (rev.projectType && rev.projectType.toLowerCase().includes(q));

              return matchesCat && matchesRating && matchesSearch;
            });

            const totalReviewPages = Math.max(1, Math.ceil(filteredReviews.length / reviewsPerPage));
            const safeReviewPage = Math.min(reviewPage, totalReviewPages);
            const currentReviews = filteredReviews.slice((safeReviewPage - 1) * reviewsPerPage, safeReviewPage * reviewsPerPage);

            if (filteredReviews.length === 0) {
              return (
                <div className="bg-slate-900/50 border border-blue-900/40 rounded-2xl p-12 text-center space-y-3 max-w-xl mx-auto">
                  <div className="w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
                    <FiSearch size={18} />
                  </div>
                  <h4 className="text-sm font-bold text-white">{t('reviews.empty')}</h4>
                  <button
                    type="button"
                    onClick={() => {
                      setReviewSearchQuery('');
                      setReviewCategoryFilter('All');
                      setReviewRatingFilter('All');
                      setReviewPage(1);
                    }}
                    className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-colors cursor-pointer"
                  >
                    {lang === 'EN' ? 'Reset Filters' : 'Reset Filter'}
                  </button>
                </div>
              );
            }

            return (
              <div className="space-y-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${safeReviewPage}-${reviewCategoryFilter}-${reviewRatingFilter}-${reviewSearchQuery}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className={`grid grid-cols-1 ${
                      currentReviews.length === 1
                        ? 'sm:grid-cols-1 max-w-md mx-auto'
                        : currentReviews.length === 2
                          ? 'sm:grid-cols-2 max-w-4xl mx-auto'
                          : 'sm:grid-cols-2 lg:grid-cols-3'
                    } gap-5 sm:gap-6 lg:gap-7 py-4 items-stretch`}
                  >
                    {currentReviews.map((rev, idx) => {
                      const tiltClass = currentReviews.length === 3
                        ? idx === 0
                          ? 'lg:-rotate-2 lg:translate-y-2 hover:lg:rotate-0 hover:lg:translate-y-0'
                          : idx === 2
                            ? 'lg:rotate-2 lg:translate-y-2 hover:lg:rotate-0 hover:lg:translate-y-0'
                            : 'lg:z-10 hover:lg:-translate-y-1.5'
                        : 'hover:-translate-y-1';

                      const starCount = Math.min(5, Math.max(1, Number(rev.rating) || 5));

                      return (
                        <div
                          key={rev.id || idx}
                          className={`bg-white rounded-2xl p-7 sm:p-8 border border-white/80 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.45)] flex flex-col items-center text-center justify-between transition-all duration-300 ${tiltClass}`}
                        >
                          <div className="w-full flex flex-col items-center">
                            {/* Centered Circular Avatar (Admin Managed) */}
                            <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-100 ring-2 ring-blue-100 shadow-sm flex items-center justify-center flex-shrink-0">
                              {rev.avatar ? (
                                <img
                                  src={getAssetUrl(rev.avatar)}
                                  alt={rev.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                                    const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                                    if (fallback) fallback.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div
                                style={{ display: rev.avatar ? 'none' : 'flex' }}
                                className="w-full h-full bg-blue-600 text-white font-bold text-base items-center justify-center"
                              >
                                {rev.name ? rev.name.charAt(0).toUpperCase() : 'K'}
                              </div>
                            </div>

                            {/* Author Identity */}
                            <h4 className="mt-4 text-sm sm:text-base font-bold text-slate-900 leading-snug">
                              — {rev.name}{rev.role ? `, ${translateText(rev.role)}` : ''}
                            </h4>

                            {/* Company & Project Type */}
                            <p className="mt-1 text-xs text-slate-500 leading-snug">
                              {rev.company || (lang === 'EN' ? 'Private Client' : 'Klien Privat')}
                              {rev.projectType ? ` · ${translateText(rev.projectType)}` : ''}
                            </p>

                            {/* Stars + Score */}
                            <div className="mt-4 flex items-center justify-center gap-1.5">
                              <div className="flex items-center gap-0.5 text-amber-500">
                                {[...Array(starCount)].map((_, i) => (
                                  <FaStar key={i} size={13} />
                                ))}
                              </div>
                              <span className="text-xs font-bold text-slate-800 tabular-nums ml-1">
                                {starCount.toFixed(1)}
                              </span>
                            </div>

                            {/* Testimonial Quote */}
                            <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-5">
                              "{translateText(rev.review)}"
                            </p>
                          </div>

                          {rev.date && (
                            <span className="mt-5 text-[11px] text-slate-400 font-medium">
                              {rev.date}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>

                {/* Carousel Pagination Dots + Prev/Next Buttons */}
                <div className="flex flex-col items-center gap-4 pt-2">
                  {/* Indicator Dots */}
                  {totalReviewPages > 1 && (
                    <div className="flex items-center justify-center gap-1.5">
                      {Array.from({ length: totalReviewPages }).map((_, i) => {
                        const pageNum = i + 1;
                        const active = safeReviewPage === pageNum;
                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => handleReviewPageChange(pageNum)}
                            aria-label={`${t('reviews.page')} ${pageNum}`}
                            className={`h-1.5 rounded-full transition-all cursor-pointer ${
                              active ? 'w-7 bg-blue-400' : 'w-1.5 bg-white/30 hover:bg-white/50'
                            }`}
                          />
                        );
                      })}
                    </div>
                  )}

                  {/* Circular Arrow Controls */}
                  {totalReviewPages > 1 && (
                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleReviewPageChange(Math.max(safeReviewPage - 1, 1))}
                        disabled={safeReviewPage === 1}
                        aria-label={t('reviews.prev')}
                        className="w-11 h-11 rounded-full bg-white/10 border border-white/20 text-white hover:bg-blue-600 hover:border-blue-500 disabled:opacity-30 disabled:pointer-events-none shadow-sm flex items-center justify-center transition-all cursor-pointer active:scale-95"
                      >
                        <FiChevronLeft size={18} />
                      </button>

                      <span className="text-xs font-semibold text-blue-200/80 tabular-nums px-2">
                        {safeReviewPage} / {totalReviewPages}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleReviewPageChange(Math.min(safeReviewPage + 1, totalReviewPages))}
                        disabled={safeReviewPage === totalReviewPages}
                        aria-label={t('reviews.next')}
                        className="w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-30 disabled:pointer-events-none shadow-lg shadow-blue-600/30 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                      >
                        <FiChevronRight size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Client Logos Ticker */}
          <div className="space-y-6 pt-8 border-t border-blue-900/40">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-blue-300/80">
              {resolveDynamicText(settings.clientsTickerTitle, 'reviews.trustedBy')}
            </p>
            <div className="relative">
              <div className="flex gap-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]">
                <div className="flex gap-6 animate-[scroll_30s_linear_infinite] min-w-max">
                  {[...clients, ...clients].map((client, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3.5 bg-blue-900/35 border border-blue-800/50 rounded-xl px-5 py-3 flex-shrink-0 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-950/40 transition-all duration-300"
                    >
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-blue-700 to-indigo-800 border-2 border-blue-400/50 flex items-center justify-center flex-shrink-0 shadow-md">
                        {client.logo || client.image ? (
                          <img
                            src={getAssetUrl(client.logo || client.image)}
                            alt={client.name}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = 'none';
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                parent.classList.add('flex', 'items-center', 'justify-center');
                                const span = document.createElement('span');
                                span.className = 'text-[10px] font-black text-white';
                                span.innerText = client.abbr || (client.name ? client.name.charAt(0) : 'K');
                                parent.appendChild(span);
                              }
                            }}
                          />
                        ) : (
                          <span className="text-[10px] font-black text-white leading-none text-center">
                            {client.abbr || (client.name ? client.name.charAt(0) : 'K')}
                          </span>
                        )}
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-slate-200 whitespace-nowrap">{client.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Review Submission Modal Dialog */}
      <AnimatePresence>
        {reviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setReviewModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl z-10 overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setReviewModalOpen(false)}
                className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <FiX size={16} />
              </button>

              {/* Image Header */}
              <div className="relative h-36 sm:h-44 w-full overflow-hidden bg-blue-900">
                <img
                  src={getAssetUrl(settings.popupImage, 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80')}
                  alt="Construction"
                  className="w-full h-full object-cover opacity-80"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent" />
                <div className="absolute bottom-4 left-6 right-6">
                  <span className="text-blue-600 font-bold uppercase tracking-widest text-[11px]">{t('modal.subtitle')}</span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">{t('modal.title')}</h3>
                </div>
              </div>

              <div className="px-6 pb-6 pt-3">
                <p className="text-xs text-slate-500 mb-4">{t('modal.desc')}</p>

              {reviewSuccessMsg ? (
                <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-xl text-center space-y-3">
                  <p className="text-sm font-bold text-emerald-700">{reviewSuccessMsg}</p>
                  <button
                    onClick={() => setReviewModalOpen(false)}
                    className="px-6 py-2 rounded-full bg-emerald-600 text-white font-bold text-xs cursor-pointer"
                  >
                    {lang === 'EN' ? 'Close' : 'Tutup'}
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!newReview.name || !newReview.review) {
                      alert(lang === 'EN' ? 'Please fill in your Name and Review' : 'Silakan isi Nama dan Ulasan Anda');
                      return;
                    }
                    setReviewSubmitting(true);
                    try {
                      const res = await fetch(`${API_BASE}/api/reviews`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newReview)
                      });
                      const result = await res.json();
                      if (result.success) {
                        setReviews(prev => [result.review, ...prev]);
                        setReviewSuccessMsg(lang === 'EN' ? 'Thank you! Your review has been submitted successfully.' : 'Terima kasih! Ulasan Anda telah berhasil ditambahkan.');
                        setNewReview({
                          name: '',
                          company: '',
                          role: '',
                          projectType: 'Residensial',
                          rating: 5,
                          review: ''
                        });
                      } else {
                        alert(result.error || (lang === 'EN' ? 'Failed to submit review' : 'Gagal mengirim ulasan'));
                      }
                    } catch (err) {
                      alert(lang === 'EN' ? 'An error occurred while submitting review' : 'Terjadi kesalahan saat mengirim ulasan');
                    } finally {
                      setReviewSubmitting(false);
                    }
                  }}
                  className="space-y-3.5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">{t('modal.nameLabel')}</label>
                      <input
                        type="text"
                        required
                        value={newReview.name}
                        onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                        placeholder={lang === 'EN' ? "e.g., John Smith" : "Contoh: Ir. Hendra"}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">{t('modal.companyLabel')}</label>
                      <input
                        type="text"
                        value={newReview.company}
                        onChange={(e) => setNewReview({ ...newReview, company: e.target.value })}
                        placeholder={lang === 'EN' ? "e.g., Apex Corporation" : "Contoh: PT Bangun Mandiri"}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">{t('modal.roleLabel')}</label>
                      <input
                        type="text"
                        value={newReview.role}
                        onChange={(e) => setNewReview({ ...newReview, role: e.target.value })}
                        placeholder={lang === 'EN' ? "e.g., Project Owner" : "Contoh: Project Owner"}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">{t('modal.typeLabel')}</label>
                      <select
                        value={newReview.projectType}
                        onChange={(e) => setNewReview({ ...newReview, projectType: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="Residensial">{lang === 'EN' ? 'Residential & Architecture' : 'Residensial & Arsitektur'}</option>
                        <option value="Komersial">{lang === 'EN' ? 'Commercial & Office' : 'Komersial & Perkantoran'}</option>
                        <option value="Industri">{lang === 'EN' ? 'Industrial & Warehouse' : 'Industri & Pabrik'}</option>
                        <option value="Infrastruktur">{lang === 'EN' ? 'Civil Infrastructure' : 'Infrastruktur Sipil'}</option>
                        <option value="Renovasi">{lang === 'EN' ? 'Renovation & Fabrication' : 'Renovasi & Fabrikasi'}</option>
                      </select>
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t('modal.ratingLabel')}</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className="p-1 focus:outline-none cursor-pointer"
                        >
                          <FaStar size={20} className={star <= newReview.rating ? 'text-amber-400' : 'text-slate-200'} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Review Text */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">{t('modal.reviewLabel')}</label>
                    <textarea
                      required
                      rows={3}
                      value={newReview.review}
                      onChange={(e) => setNewReview({ ...newReview, review: e.target.value })}
                      placeholder={lang === 'EN' ? "Share your experience with workmanship quality, timelines, and collaboration..." : "Bagikan pengalaman kerjasama, ketepatan waktu, dan kualitas pengerjaan..."}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/25 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <FiStar size={16} />
                    {reviewSubmitting ? t('modal.submitting') : t('modal.submitBtn')}
                  </button>
                </form>
              )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                  src={getAssetUrl(selectedProject.img)}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?w=800&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>

              <div className="p-8 md:p-12 flex flex-col justify-between space-y-6 overflow-y-auto max-h-[85vh]">
                <div className="space-y-4">
                  <span className="text-primary font-bold uppercase tracking-widest text-xs">
                    {t('projects.detailsHeader')} • {(() => {
                      if (selectedProject.category === 'Residential') return lang === 'EN' ? 'Residential' : 'Residensial';
                      if (selectedProject.category === 'Commercial') return lang === 'EN' ? 'Commercial' : 'Komersial';
                      if (selectedProject.category === 'Industrial') return lang === 'EN' ? 'Industrial' : 'Industri';
                      if (selectedProject.category === 'Infrastructure') return lang === 'EN' ? 'Infrastructure' : 'Infrastruktur';
                      return selectedProject.category;
                    })()}
                  </span>
                  <h3 className="text-3xl font-black text-on-surface leading-tight">
                    {translateText(selectedProject.title)}
                  </h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">
                    {translateText(selectedProject.fullDesc)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-outline-variant/30 pt-6">
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">{t('projects.client')}</span>
                    <span className="text-sm font-semibold text-on-surface">{translateText(selectedProject.client)}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">{t('projects.budget')}</span>
                    <span className="text-sm font-semibold text-primary">{selectedProject.budget}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <FiMap className="text-primary text-base" />
                    <div>
                      <span className="block text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">{t('projects.location')}</span>
                      <span className="text-sm font-semibold text-on-surface">{translateText(selectedProject.location)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <FiCalendar className="text-primary text-base" />
                    <div>
                      <span className="block text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">{t('projects.duration')}</span>
                      <span className="text-sm font-semibold text-on-surface">{translateText(selectedProject.duration)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <a
                    href={`https://wa.me/${settings.whatsappNumber || '6281234567890'}?text=Halo%20${encodeURIComponent(settings.companyName || 'Raya Konstruksi Jaya')},%20saya%20ingin%20bertanya%20detail%20mengenai%20proyek%20${encodeURIComponent(selectedProject.title)}.`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-primary hover:opacity-95 text-white font-bold py-3 rounded-lg text-sm transition-opacity"
                  >
                    {t('projects.inquire')}
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Section - Clean Centered Dark Banner */}
      <section id="contact" className="relative py-20 sm:py-32 px-4 sm:px-8 overflow-hidden scroll-mt-24">
        {/* Background Image / Video */}
        <div className="absolute inset-0 z-0">
          {settings.contactBgType === 'video' && settings.contactVideo ? (
            getYouTubeEmbedId(settings.contactVideo) ? (
              <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none flex items-center justify-center">
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeEmbedId(settings.contactVideo)}?autoplay=1&mute=1&loop=1&playlist=${getYouTubeEmbedId(settings.contactVideo)}&controls=0&showinfo=0&rel=0&modestbranding=1&disablekb=1&playsinline=1`}
                  title="Contact Background Video"
                  className="w-[100vw] h-[56.25vw] min-h-full min-w-[177.77vh] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            ) : (
              <video
                src={settings.contactVideo}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            )
          ) : (
            <img 
              src={getAssetUrl(settings.contactImage, '/galery/WhatsApp Image 2026-07-01 at 23.38.37.jpeg')} 
              alt="Construction site" 
              className="w-full h-full object-cover"
            />
          )}
          {/* Dynamic Clear Overlay */}
          <div 
            className="absolute inset-0 bg-slate-950 transition-opacity duration-300"
            style={{ 
              opacity: (settings.contactOverlayOpacity !== undefined && settings.contactOverlayOpacity !== '')
                ? Number(settings.contactOverlayOpacity) / 100 
                : 0.35 
            }}
          />
          {/* Subtle top & bottom edge gradients for seamless transition */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950/70 pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <div className="space-y-6">
            <span className="text-primary-container text-xs font-black uppercase tracking-[0.25em] drop-shadow-md">{t('contact.badge')}</span>
            <h2 className="text-2xl sm:text-4xl md:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
              {resolveDynamicText(settings.contactTitle, 'contact.title')}
            </h2>
            <p className="text-white/95 max-w-xl mx-auto text-sm md:text-base leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)] font-medium">
              {resolveDynamicText(settings.contactDesc, 'contact.desc')}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 pt-6">
              <a 
                href={`https://wa.me/${settings.whatsappNumber || '6281234567890'}?text=Halo%20${encodeURIComponent(settings.companyName || 'Raya Konstruksi Jaya')},%20saya%20tertarik%20untuk%20konsultasi%20proyek.`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 sm:gap-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-green-500/50 text-white font-bold py-3.5 sm:py-4.5 px-5 sm:px-8 rounded-2xl transition-all duration-300 backdrop-blur-md hover:scale-[1.02] shadow-xl text-xs sm:text-sm md:text-base cursor-pointer"
              >
                <FaWhatsapp className="text-xl text-green-400" />
                <span>{t('contact.btnWa')}</span>
              </a>
              <button 
                type="button"
                onClick={() => {
                  setEmailModalSubject(`Konsultasi Rencana Proyek - ${settings.companyName || 'Raya Konstruksi Jaya'}`);
                  setEmailModalBody(`Halo Tim ${settings.companyName || 'Raya Konstruksi Jaya'},\n\nSaya tertarik untuk berkonsultasi mengenai rencana proyek saya.\nMohon informasi lebih lanjut mengenai tahapan, estimasi biaya, dan jadwal pengerjaan.\n\nTerima kasih.`);
                  setIsEmailModalOpen(true);
                }}
                className="inline-flex items-center gap-2 sm:gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary-container/50 text-white font-bold py-3.5 sm:py-4.5 px-5 sm:px-8 rounded-2xl transition-all duration-300 backdrop-blur-md hover:scale-[1.02] shadow-xl text-xs sm:text-sm md:text-base cursor-pointer"
              >
                <FiMail className="text-xl text-primary-container" />
                <span>{t('contact.btnEmail')}</span>
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* Consultation Choice Modal */}
      <AnimatePresence>
        {consultService && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setConsultService(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[700px] bg-[#F7F7F7] rounded-3xl shadow-2xl overflow-hidden z-10 grid grid-cols-1 md:grid-cols-2"
            >
              {/* Close Button */}
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setConsultService(null);
                }} 
                aria-label="Tutup modal"
                className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-xs text-white flex items-center justify-center cursor-pointer transition-all active:scale-95"
              >
                <FiX size={16} />
              </button>

              {/* Left Side: Content & Actions */}
              <div className="p-7 sm:p-8 flex flex-col justify-center space-y-5 order-2 md:order-1">
                <div className="space-y-1.5">
                  <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-blue-600">
                    {consultService}
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    {lang === 'EN' ? 'Start Consultation' : 'Mulai Konsultasi'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    {t('consult.subtitle')}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2.5">
                  {/* WhatsApp */}
                  <a
                    href={(() => {
                      const company = settings.companyName || 'Raya Konstruksi Jaya';
                      const waNum = (settings.whatsappNumber || '6281234567890').replace(/\D/g, '');
                      const template = t('consult.waTemplate')
                        .replace('{company}', company)
                        .replace('{service}', consultService || '');
                      return `https://wa.me/${waNum}?text=${encodeURIComponent(template)}`;
                    })()}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setConsultService(null)}
                    className="w-full flex items-center justify-center gap-2.5 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all no-underline cursor-pointer shadow-sm"
                  >
                    <FaWhatsapp size={18} />
                    <span>{t('consult.viaWa')}</span>
                  </a>

                  {/* Email - Langsung buka Gmail compose tanpa popup kedua */}
                  <button
                    type="button"
                    onClick={() => {
                      const company = settings.companyName || 'Raya Konstruksi Jaya';
                      const cleanEmail = settings.emailAddress || 'contact@rayakonstruksi.com';
                      const subject = t('consult.emailSubject')
                        .replace('{service}', consultService || '')
                        .replace('{company}', company);
                      const body = t('consult.emailBody')
                        .replace(/\{company\}/g, company)
                        .replace(/\{service\}/g, consultService || '');
                      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(cleanEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                      window.open(gmailUrl, '_blank', 'noopener,noreferrer');
                      setConsultService(null);
                    }}
                    className="w-full flex items-center justify-center gap-2.5 py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all cursor-pointer shadow-sm"
                  >
                    <FiMail size={16} />
                    <span>{t('consult.viaEmail')}</span>
                  </button>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-200/80 text-[11px] text-slate-400">
                  <span>{lang === 'ID' ? 'Respon 1x24 jam' : 'Response within 24h'}</span>
                  <button
                    type="button"
                    onClick={() => setConsultService(null)}
                    className="font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    {lang === 'EN' ? 'Cancel' : 'Batal'}
                  </button>
                </div>
              </div>

              {/* Right Side: Full-Bleed Image */}
              <div className="relative h-48 md:h-auto md:min-h-[340px] w-full overflow-hidden bg-slate-200 order-1 md:order-2">
                <img
                  src={getAssetUrl(settings.popupImage, 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80')}
                  alt="Construction"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80';
                  }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cinematic Fullscreen Video Lightbox Modal */}
      <AnimatePresence>
        {isVideoFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 md:p-8"
            onClick={closeFullscreen}
          >
            {/* Top Navigation Bar */}
            <div 
              className="w-full max-w-6xl mx-auto flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-blue-600/30 border border-blue-500/40 px-3.5 py-1.5 rounded-full">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  <span className="text-xs font-bold text-blue-200 tracking-wider uppercase">
                    {lang === 'EN' ? 'Cinematic View' : 'Dokumentasi Proyek'}
                  </span>
                </div>
                <h3 className="hidden sm:block text-white font-bold text-sm md:text-base truncate max-w-md">
                  {lang === 'EN' ? 'Raya Konstruksi Jaya — Precision Engineering' : 'Raya Konstruksi Jaya — Presisi Konstruksi Nyata'}
                </h3>
              </div>

              {/* Action Controls: Perkecil (Minimize) & Close */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Perkecil / Minimize Button */}
                <button
                  type="button"
                  onClick={closeFullscreen}
                  className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 backdrop-blur-md transition-all hover:scale-105"
                  title={lang === 'EN' ? 'Minimize back to normal' : 'Perkecil kembali ke ukuran normal'}
                >
                  <FiMinimize className="text-base text-blue-400" />
                  <span>{lang === 'EN' ? 'Minimize' : 'Perkecil'}</span>
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={closeFullscreen}
                  className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-red-500/80 text-white transition-all hover:scale-105 border border-white/20"
                  title={lang === 'EN' ? 'Close' : 'Tutup'}
                >
                  <FiX className="text-lg" />
                </button>
              </div>
            </div>

            {/* Main Video in Full Screen */}
            <div 
              className="flex-1 flex items-center justify-center w-full max-w-6xl mx-auto my-auto py-2 sm:py-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9)] border border-white/15 bg-black">
                <video
                  ref={fullscreenVideoRef}
                  src={getAboutVideoSrc()}
                  autoPlay
                  controls
                  loop
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Bottom Info Bar */}
            <div 
              className="w-full max-w-6xl mx-auto pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-white/60"
              onClick={(e) => e.stopPropagation()}
            >
              <p>
                {lang === 'EN' 
                  ? '💡 Tip: Click "Minimize", the (✕) button, or press ESC to shrink back.' 
                  : '💡 Tips: Klik "Perkecil", tombol (✕), atau tekan tombol ESC untuk kembali ke ukuran normal.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  closeFullscreen();
                  setIsVideoMini(true);
                }}
                className="text-blue-400 hover:text-blue-300 font-semibold hover:underline flex items-center gap-1.5"
              >
                <FiMinimize size={13} />
                <span>{lang === 'EN' ? 'Switch to Mini Floating Player' : 'Beralih ke Pemutar Mini Melayang'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Mini Player (Kecil Melayang di Pojok Kanan Bawah) */}
      <AnimatePresence>
        {isVideoMini && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.85 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-5 sm:right-8 z-50 w-72 sm:w-80 rounded-2xl overflow-hidden shadow-2xl border-2 border-blue-500/40 bg-slate-950 backdrop-blur-md"
          >
            {/* Mini Player Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-slate-900/95 border-b border-white/10 text-white text-xs">
              <span className="font-bold flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                {lang === 'EN' ? 'Mini Player' : 'Pemutar Video Mini'}
              </span>
              <div className="flex items-center gap-1">
                {/* Perbesar / Maximize */}
                <button
                  type="button"
                  onClick={() => {
                    setIsVideoMini(false);
                    openFullscreen();
                  }}
                  className="p-1.5 hover:bg-white/20 rounded-md text-white transition-colors"
                  title={lang === 'EN' ? 'Full Screen' : 'Layar Penuh'}
                >
                  <FiMaximize size={13} />
                </button>
                {/* Close Mini Player */}
                <button
                  type="button"
                  onClick={() => setIsVideoMini(false)}
                  className="p-1.5 hover:bg-red-500/80 rounded-md text-white transition-colors"
                  title={lang === 'EN' ? 'Close' : 'Tutup'}
                >
                  <FiX size={14} />
                </button>
              </div>
            </div>

            {/* Mini Video */}
            <div className="relative aspect-video bg-black group">
              <video
                src={getAboutVideoSrc()}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div 
                onClick={() => {
                  setIsVideoMini(false);
                  openFullscreen();
                }}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
              >
                <span className="bg-blue-600/95 text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                  <FiMaximize size={11} /> {lang === 'EN' ? 'Full Screen' : 'Perbesar'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Email Contact Modal */}
      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        emailAddress={settings.emailAddress || 'contact@rayakonstruksi.com'}
        companyName={settings.companyName || 'Raya Konstruksi Jaya'}
        defaultSubject={emailModalSubject || `Konsultasi Proyek - ${settings.companyName || 'Raya Konstruksi Jaya'}`}
        defaultBody={emailModalBody || `Halo Tim ${settings.companyName || 'Raya Konstruksi Jaya'},\n\nSaya ingin berkonsultasi mengenai kebutuhan proyek saya.\n\nTerima kasih.`}
        popupImage={getAssetUrl(settings.popupImage, 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80')}
      />
    </div>
  );
};

export default Home;
