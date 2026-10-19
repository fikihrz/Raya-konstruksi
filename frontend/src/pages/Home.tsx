import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { FiHome, FiArrowRight, FiPhoneCall, FiMail, FiMapPin, FiX, FiCalendar, FiMap, FiChevronLeft, FiChevronRight, FiPause, FiPlay, FiStar, FiEdit3, FiMaximize, FiMinimize, FiVolume2, FiVolumeX } from 'react-icons/fi';
import { FaWhatsapp, FaStar } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const Home = () => {
  const { t, lang, translateText } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [activeAboutTab, setActiveAboutTab] = useState<'story' | 'vision' | 'mission'>('story');

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const [services, setServices] = useState<any[]>([]);
  const [reasons, setReasons] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);

  // Portfolio Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;

  // Review Form & Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');
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

  const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://backend-three-beta-90.vercel.app';

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
      })
      .catch(err => {
        console.error("Failed to fetch data:", err);
        setLoading(false);
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

  // Listen to search events from Navbar
  useEffect(() => {
    const handleSearchEvent = (e: any) => {
      const q = e.detail || '';
      setSearchQuery(q);
      if (q) {
        setActiveCategory('All');
        setCurrentPage(1);
      }
    };
    window.addEventListener('site-search', handleSearchEvent);
    return () => window.removeEventListener('site-search', handleSearchEvent);
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
      <section className="relative w-full overflow-hidden bg-black h-screen min-h-[620px]">
        
        {/* Slides Definition */}
        {(() => {
          const slides = [
            {
              id: 1,
              tag: lang === 'EN' ? t('hero.tag1') : (settings.heroTag1 && settings.heroTag1 !== "ARCHITECTURE & DESIGN" ? settings.heroTag1 : t('hero.tag1')),
              title: lang === 'EN' ? t('hero.title1') : (settings.heroTitle || t('hero.title1')),
              subtitle: lang === 'EN' ? t('hero.sub1') : (settings.heroDesc || t('hero.sub1')),
              img: settings.heroImage || "/galery/WhatsApp Image 2026-07-01 at 23.38.36.jpeg",
              cta: t('hero.cta1')
            },
            {
              id: 2,
              tag: lang === 'EN' ? t('hero.tag2') : (settings.heroTag2 && settings.heroTag2 !== "COMMERCIAL DEVELOPMENT" ? settings.heroTag2 : t('hero.tag2')),
              title: lang === 'EN' ? t('hero.title2') : (settings.heroTitle2 || t('hero.title2')),
              subtitle: lang === 'EN' ? t('hero.sub2') : (settings.heroDesc2 || t('hero.sub2')),
              img: settings.heroImage2 || "/galery/WhatsApp Image 2026-07-01 at 23.38.36 (2).jpeg",
              cta: t('hero.cta2')
            },
            {
              id: 3,
              tag: lang === 'EN' ? t('hero.tag3') : (settings.heroTag3 && settings.heroTag3 !== "INDUSTRIAL INFRASTRUCTURE" ? settings.heroTag3 : t('hero.tag3')),
              title: lang === 'EN' ? t('hero.title3') : (settings.heroTitle3 || t('hero.title3')),
              subtitle: lang === 'EN' ? t('hero.sub3') : (settings.heroDesc3 || t('hero.sub3')),
              img: settings.heroImage3 || "/galery/WhatsApp Image 2026-07-01 at 23.38.37.jpeg",
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
                      className="w-full h-full object-cover filter brightness-[0.72] contrast-[1.12]"
                    />
                    {/* Deep gradient overlays matching Kiewit's bottom-left focus */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/30" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom-Left Content (Kiewit Style) */}
              <div className="absolute bottom-0 left-0 right-0 z-10 pb-20 sm:pb-24 px-6 sm:px-12 lg:px-20 max-w-5xl">
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

      {/* About Section */}
      <section id="about" className="py-24 px-6 sm:px-8 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Premium Cinematic Video Showcase (Styled exactly like YouTube player from user screenshot) */}
          <div className="lg:col-span-6 w-full">
            {getYouTubeEmbedId(settings.aboutVideo) ? (
              /* If YouTube URL is configured, use native YouTube player embed */
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-100 bg-slate-950 aspect-[16/10] sm:aspect-[16/9]">
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeEmbedId(settings.aboutVideo)}?autoplay=1&mute=1&loop=1&playlist=${getYouTubeEmbedId(settings.aboutVideo)}&controls=1&rel=0`}
                  title="Company Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            ) : (
              /* HTML5 Player with YouTube UI: center Pause/Play, timeline scrubber, time display, and bottom-right Fullscreen toggle */
              <div 
                ref={videoContainerRef}
                className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-100 bg-black aspect-[16/10] sm:aspect-[16/9] group select-none flex flex-col justify-between"
              >
                {/* HTML5 Loop Video */}
                <video
                  ref={videoRef}
                  src={settings.aboutVideo || '/construction-video.mp4'}
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

          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-3">
              <span className="text-primary font-bold uppercase tracking-widest text-xs">{lang === 'EN' ? t('about.badge') : (settings.aboutBadge || 'Behind The Blueprint')}</span>
              <h2 className="text-4xl md:text-5xl font-black text-on-surface leading-tight">
                {lang === 'EN' ? t('about.title') : ((settings.aboutTitle && settings.aboutTitle !== 'Raya Konstruksi') ? settings.aboutTitle : 'Raya Konstruksi Jaya')}
              </h2>
            </div>

            <div className="flex border-b border-outline-variant/30 text-sm font-semibold">
              {[
                { id: 'story', label: t('about.tabStory') },
                { id: 'vision', label: t('about.tabVision') },
                { id: 'mission', label: t('about.tabMission') }
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
                      {lang === 'EN' ? t('about.story') : (settings.aboutStory ? settings.aboutStory.replace(/Raya Konstruksi(?!\s+Jaya)/g, 'Raya Konstruksi Jaya') : t('about.story'))}
                    </p>
                    <p className="text-on-surface-variant leading-relaxed text-sm">
                      {lang === 'EN' ? t('about.story2') : (settings.aboutStory2 || t('about.story2'))}
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
                    <h4 className="text-lg font-bold text-on-surface mb-2">
                      {lang === 'EN' ? t('about.visionTitle') : (settings.visionTitle || t('about.visionTitle'))}
                    </h4>
                    <p className="text-on-surface-variant leading-relaxed text-base italic">
                      "{lang === 'EN' ? t('about.visionDesc') : (settings.visionDesc || t('about.visionDesc'))}"
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
                      lang === 'EN' ? t('about.mission1') : (settings.mission1 || t('about.mission1')),
                      lang === 'EN' ? t('about.mission2') : (settings.mission2 || t('about.mission2')),
                      lang === 'EN' ? t('about.mission3') : (settings.mission3 || t('about.mission3'))
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
      <section id="why-us" className="py-24 bg-slate-900 px-8 relative overflow-hidden scroll-mt-20">
        {/* Abstract background blobs for premium feel */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-4 mb-16">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold uppercase tracking-widest text-[10px]">
              {t('whyUs.badge')}
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              {lang === 'EN' ? t('whyUs.title') : (settings.whyTitle || t('whyUs.title'))}
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed">
              {lang === 'EN' ? t('whyUs.desc') : (settings.whyDesc || t('whyUs.desc'))}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reasons.map((reason, i) => {
              const rTitle = t(`whyUs.r${i + 1}.title`);
              const rDesc = t(`whyUs.r${i + 1}.desc`);
              return (
                <div key={i} className="group relative bg-slate-800/40 hover:bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 hover:border-blue-500/50 p-8 rounded-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/20 flex flex-col items-center md:items-start text-center md:text-left space-y-5">
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
      <section className="py-24 bg-white px-4 sm:px-8">
        <div id="services" className="max-w-7xl mx-auto space-y-8 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col space-y-3 max-w-3xl">
              <span className="text-primary font-bold uppercase tracking-widest text-xs">{t('services.badge')}</span>
              <h2 className="text-3xl md:text-5xl font-black text-on-surface leading-tight">{lang === 'EN' ? t('services.title') : (settings.servicesTitle || t('services.title'))}</h2>
              <p className="text-on-surface-variant text-base leading-relaxed">
                {lang === 'EN' ? t('services.desc') : (settings.servicesDesc || t('services.desc'))}
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
              const sTitle = t(`services.s${idx + 1}.title`) || service.title;
              const sDesc = t(`services.s${idx + 1}.desc`) || service.desc;
              return (
                <div
                  key={idx}
                  className="group relative bg-white border border-blue-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between flex-shrink-0 w-[290px] sm:w-[320px] h-[390px] snap-start"
                >
                  <div className="h-48 overflow-hidden bg-blue-900 relative">
                    <img
                      src={service.img}
                      alt={sTitle}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
                    <a href="#contact" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:gap-3 transition-all pt-4">
                      {t('services.btnConsult')} <FiArrowRight />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Client Logos & Real Testimonials Section */}
      <section id="clients" className="py-24 bg-gradient-to-b from-blue-950 via-slate-950 to-blue-950 text-white overflow-hidden scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16">
          
          {/* Header with Add Review Button */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="text-blue-400 font-bold uppercase tracking-widest text-xs">{t('reviews.badge')}</span>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">{t('reviews.title')}</h2>
              <p className="text-blue-200/70 text-sm sm:text-base leading-relaxed">
                {t('reviews.desc')}
              </p>
            </div>

            {/* Button to open Review Submission Modal */}
            <button
              onClick={() => {
                setReviewSuccessMsg('');
                setReviewModalOpen(true);
              }}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all self-start md:self-auto cursor-pointer"
            >
              <FiEdit3 size={16} />
              <span>{t('reviews.btnWrite')}</span>
            </button>
          </div>

          {/* Testimonial Cards Slider / Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.slice(0, 6).map((rev, idx) => (
              <div
                key={idx}
                className="bg-slate-900/70 border border-blue-900/40 hover:border-blue-500/50 p-7 rounded-2xl flex flex-col justify-between space-y-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-950/50"
              >
                <div className="space-y-4">
                  {/* Rating Stars & Project Type */}
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400 gap-1">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <FaStar key={i} size={14} />
                      ))}
                    </div>
                    <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-950/80 px-2.5 py-1 rounded-full border border-blue-800/40">
                      {translateText(rev.projectType || 'Konstruksi')}
                    </span>
                  </div>

                  {/* Review Text */}
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed italic">
                    "{translateText(rev.review)}"
                  </p>
                </div>

                {/* Reviewer Profile */}
                <div className="flex items-center gap-3.5 pt-4 border-t border-slate-800/80">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black flex items-center justify-center text-sm shadow-md flex-shrink-0">
                    {rev.name ? rev.name.charAt(0).toUpperCase() : 'K'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-snug">{rev.name}</h4>
                    <p className="text-[11px] text-slate-400">{rev.role ? `${translateText(rev.role)} • ` : ''}{rev.company}</p>
                    <span className="text-[10px] text-blue-400/80">{rev.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Client Logos Ticker */}
          <div className="space-y-6 pt-4 border-t border-blue-900/30">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-blue-400/80">
              {t('reviews.trustedBy')}
            </p>
            <div className="relative">
              <div className="flex gap-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]">
                <div className="flex gap-8 animate-[scroll_30s_linear_infinite] min-w-max">
                  {[...clients, ...clients].map((client, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3.5 bg-blue-900/30 border border-blue-800/40 rounded-xl px-5 py-3 flex-shrink-0 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-950/40 transition-all duration-300"
                    >
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-blue-700 to-indigo-800 border-2 border-blue-400/50 flex items-center justify-center flex-shrink-0 shadow-md">
                        {client.logo || client.image ? (
                          <img
                            src={client.logo || client.image}
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

      {/* Projects Section with Pagination */}
      <section id="projects" className="py-24 px-6 sm:px-8 bg-slate-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-slate-200 pb-8">
            <div className="space-y-3">
              <span className="text-primary font-bold uppercase tracking-widest text-sm">{t('projects.badge')}</span>
              <h2 className="text-3xl md:text-5xl font-black text-on-surface">{t('projects.title')}</h2>
              <p className="text-on-surface-variant text-sm max-w-xl">
                {t('projects.desc')}
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
                { key: 'Infrastructure', label: t('projects.filterInfrastructure') }
              ].map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => {
                    setActiveCategory(cat.key);
                    setCurrentPage(1);
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {currentProjects.map((p, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedProject(p)}
                      className="group relative overflow-hidden rounded-2xl bg-slate-900 shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer h-[380px] flex flex-col justify-end"
                    >
                      <img
                        className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-70 transition-all duration-700"
                        src={p.img}
                        alt={p.title}
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="relative z-10 p-7 bg-gradient-to-t from-black/95 via-black/50 to-transparent flex flex-col justify-end text-white">
                        <span className="text-blue-400 font-extrabold text-[11px] uppercase tracking-wider mb-1">
                          {(() => {
                            if (p.category === 'Residential') return lang === 'EN' ? 'Residential' : 'Residensial';
                            if (p.category === 'Commercial') return lang === 'EN' ? 'Commercial' : 'Komersial';
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

                {/* Portfolio Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-8">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                            onClick={() => setCurrentPage(pageNum)}
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
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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

      {/* Review Submission Modal Dialog */}
      <AnimatePresence>
        {reviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setReviewModalOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 z-10 text-white"
            >
              <button
                onClick={() => setReviewModalOpen(false)}
                className="absolute top-5 right-5 h-8 w-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <FiX size={18} />
              </button>

              <div className="space-y-2 mb-6">
                <span className="text-blue-400 font-bold uppercase tracking-widest text-[11px]">{t('modal.subtitle')}</span>
                <h3 className="text-2xl font-black text-white">{t('modal.title')}</h3>
                <p className="text-xs text-slate-400">
                  {t('modal.desc')}
                </p>
              </div>

              {reviewSuccessMsg ? (
                <div className="bg-emerald-500/20 border border-emerald-500/40 p-5 rounded-xl text-center space-y-3">
                  <p className="text-sm font-bold text-emerald-300">{reviewSuccessMsg}</p>
                  <button
                    onClick={() => setReviewModalOpen(false)}
                    className="px-6 py-2 rounded-full bg-emerald-600 text-white font-bold text-xs"
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
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">{t('modal.nameLabel')}</label>
                      <input
                        type="text"
                        required
                        value={newReview.name}
                        onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                        placeholder={lang === 'EN' ? "e.g., John Smith" : "Contoh: Ir. Hendra"}
                        className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">{t('modal.companyLabel')}</label>
                      <input
                        type="text"
                        value={newReview.company}
                        onChange={(e) => setNewReview({ ...newReview, company: e.target.value })}
                        placeholder={lang === 'EN' ? "e.g., Apex Corporation" : "Contoh: PT Bangun Mandiri"}
                        className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">{t('modal.roleLabel')}</label>
                      <input
                        type="text"
                        value={newReview.role}
                        onChange={(e) => setNewReview({ ...newReview, role: e.target.value })}
                        placeholder={lang === 'EN' ? "e.g., Project Owner" : "Contoh: Project Owner"}
                        className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">{t('modal.typeLabel')}</label>
                      <select
                        value={newReview.projectType}
                        onChange={(e) => setNewReview({ ...newReview, projectType: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="Residensial">{lang === 'EN' ? 'Residential & Architecture' : 'Residensial & Arsitektur'}</option>
                        <option value="Komersial">{lang === 'EN' ? 'Commercial & Office' : 'Komersial & Perkantoran'}</option>
                        <option value="Industri">{lang === 'EN' ? 'Industrial & Warehouse' : 'Industri & Pabrik'}</option>
                        <option value="Infrastruktur">{lang === 'EN' ? 'Civil Infrastructure' : 'Infrastruktur Sipil'}</option>
                        <option value="Renovasi">{lang === 'EN' ? 'Renovation & Fabrication' : 'Renovasi & Fabrikasi'}</option>
                      </select>
                    </div>
                  </div>

                  {/* Rating Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">{t('modal.ratingLabel')}</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className="p-1 focus:outline-none cursor-pointer"
                        >
                          <FaStar size={20} className={star <= newReview.rating ? 'text-amber-400' : 'text-slate-600'} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Review Text Area */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">{t('modal.reviewLabel')}</label>
                    <textarea
                      required
                      rows={4}
                      value={newReview.review}
                      onChange={(e) => setNewReview({ ...newReview, review: e.target.value })}
                      placeholder={lang === 'EN' ? "Share your experience with workmanship quality, timelines, and collaboration..." : "Bagikan pengalaman kerjasama, ketepatan waktu, dan kualitas pengerjaan Raya Konstruksi Jaya..."}
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="w-full py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {reviewSubmitting ? t('modal.submitting') : t('modal.submitBtn')}
                  </button>
                </form>
              )}
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
                  src={selectedProject.img}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>

              <div className="p-8 md:p-12 flex flex-col justify-between space-y-6 overflow-y-auto max-h-[85vh]">
                <div className="space-y-4">
                  <span className="text-primary font-bold uppercase tracking-widest text-xs">
                    {t('projects.detailsHeader')} • {(() => {
                      if (selectedProject.category === 'Residential') return lang === 'EN' ? 'Residential' : 'Residensial';
                      if (selectedProject.category === 'Commercial') return lang === 'EN' ? 'Commercial' : 'Komersial';
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
      <section id="contact" className="relative py-32 px-8 overflow-hidden scroll-mt-24">
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
            <span className="text-primary-container text-xs font-black uppercase tracking-[0.25em]">{t('contact.badge')}</span>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
              {lang === 'EN' ? t('contact.title') : (settings.contactTitle || t('contact.title'))}
            </h2>
            <p className="text-white/60 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
              {lang === 'EN' ? t('contact.desc') : (settings.contactDesc || t('contact.desc'))}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <a 
                href={`https://wa.me/${settings.whatsappNumber || '6281234567890'}?text=Halo%20${encodeURIComponent(settings.companyName || 'Raya Konstruksi Jaya')},%20saya%20tertarik%20untuk%20konsultasi%20proyek.`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-green-500/50 text-white font-bold py-4.5 px-8 rounded-2xl transition-all duration-300 backdrop-blur-md hover:scale-[1.02] shadow-xl text-sm md:text-base cursor-pointer"
              >
                <FaWhatsapp className="text-xl text-green-400" />
                <span>{t('contact.btnWa')}</span>
              </a>
              <a 
                href={`mailto:${settings.emailAddress || 'contact@rayakonstruksi.com'}?subject=Konsultasi Rencana Proyek ${settings.companyName || 'Raya Konstruksi Jaya'}`}
                className="inline-flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary-container/50 text-white font-bold py-4.5 px-8 rounded-2xl transition-all duration-300 backdrop-blur-md hover:scale-[1.02] shadow-xl text-sm md:text-base cursor-pointer"
              >
                <FiMail className="text-xl text-primary-container" />
                <span>{t('contact.btnEmail')}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

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
                  src={settings.aboutVideo || '/construction-video.mp4'}
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
                src={settings.aboutVideo || '/construction-video.mp4'}
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
    </div>
  );
};

export default Home;
