import React, { useState, useEffect, useRef } from 'react';
import { FaVolumeHigh, FaVolumeXmark, FaArrowUpRightFromSquare } from 'react-icons/fa6';

export const DEFAULT_VIDEO_BANNER = {
  enabled: true,
  videoUrl: 'https://res.cloudinary.com/demo/video/upload/q_auto,vc_auto/snow_horses.mp4',
  posterUrl: 'https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=1920&q=80',
  title: 'Himalayan Expeditions & Mountain Escapes',
  subtitle: 'Experience snow-capped peaks, alpine trails, and raw wilderness magic',
  targetUrl: '/group-trips',
  buttonText: 'Explore Expeditions ↗',
  autoplay: true,
  loop: true,
  muted: true
};

export default function VideoBannerSection({ onBannerClick }) {
  const [config, setConfig] = useState(() => {
    try {
      const stored = localStorage.getItem('travel_video_banner_settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Exclude legacy badge and aditi video if present
        delete parsed.badge;
        if (parsed.videoUrl && parsed.videoUrl.includes('Aditi')) {
          delete parsed.videoUrl;
        }
        return { ...DEFAULT_VIDEO_BANNER, ...parsed };
      }
    } catch {}
    return DEFAULT_VIDEO_BANNER;
  });

  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  // Sync settings when modified from Admin panel
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem('travel_video_banner_settings');
        if (stored) {
          const parsed = JSON.parse(stored);
          delete parsed.badge;
          setConfig({ ...DEFAULT_VIDEO_BANNER, ...parsed });
        } else {
          setConfig(DEFAULT_VIDEO_BANNER);
        }
      } catch {}
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (!config.enabled) return null;

  const toggleMute = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleClick = () => {
    if (onBannerClick) {
      onBannerClick(config);
    } else if (config.targetUrl) {
      if (config.targetUrl.startsWith('http')) {
        window.open(config.targetUrl, '_blank', 'noopener,noreferrer');
      } else {
        window.history.pushState(null, '', config.targetUrl);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    }
  };

  return (
    <section className="w-full my-8 sm:my-12 md:my-16">
      <div className="container mx-auto px-4 md:px-6">
        <div
          onClick={handleClick}
          className="group relative w-full h-[240px] sm:h-[320px] md:h-[420px] lg:h-[480px] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl cursor-pointer bg-slate-900 border border-black/10 transition-all duration-300 hover:shadow-3xl"
        >
          {/* Main Video Element (Autoplay & Loop) */}
          <video
            ref={videoRef}
            src={config.videoUrl}
            poster={config.posterUrl}
            autoPlay={config.autoplay}
            loop={config.loop}
            muted={isMuted}
            playsInline
            preload="metadata"
            className="w-full h-full object-cover object-center filter brightness-[0.92] transition-transform duration-700 group-hover:scale-[1.01]"
          />

          {/* Subtle vignette/gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

          {/* Sound Control in Top Right (Pause button and Creator badge removed) */}
          <div className="absolute top-4 right-4 z-20">
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black/70 transition-all duration-200 shadow-md"
            >
              {isMuted ? <FaVolumeXmark className="text-xs" /> : <FaVolumeHigh className="text-xs" />}
            </button>
          </div>

          {/* Bottom Overlay Info & Call-to-Action */}
          <div className="absolute bottom-5 sm:bottom-8 left-5 sm:left-8 right-5 sm:right-8 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pointer-events-none">
            <div className="max-w-xl text-white">
              {config.title && (
                <h3 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-lg leading-tight mb-1.5">
                  {config.title}
                </h3>
              )}
              {config.subtitle && (
                <p className="text-xs sm:text-sm md:text-base text-gray-200/90 drop-shadow-md line-clamp-2">
                  {config.subtitle}
                </p>
              )}
            </div>

            {config.buttonText && (
              <div className="pointer-events-auto shrink-0">
                <button
                  type="button"
                  onClick={handleClick}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm bg-white text-gray-900 hover:bg-gray-100 shadow-xl transition-all duration-200 transform group-hover:scale-105"
                >
                  <span>{config.buttonText}</span>
                  <FaArrowUpRightFromSquare className="text-xs" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
