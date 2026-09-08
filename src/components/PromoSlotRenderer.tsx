import React, { useState, useEffect } from 'react';
import { PromoMediaSlot } from '../types';
import { Play, Volume2, VolumeX, Image as ImageIcon } from 'lucide-react';

interface PromoSlotRendererProps {
  slot?: PromoMediaSlot;
  className?: string;
  fallbackImage?: string;
  aspectClass?: string;
}

export const PromoSlotRenderer: React.FC<PromoSlotRendererProps> = ({
  slot,
  className = '',
  fallbackImage = 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=85',
}) => {
  const mediaType = slot?.type || 'image';
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Slideshow auto-advance
  const slideshowImages = slot?.slideshowImages && slot.slideshowImages.length > 0
    ? slot.slideshowImages
    : [slot?.imageUrl || fallbackImage];

  useEffect(() => {
    if (mediaType !== 'slideshow' || slideshowImages.length <= 1) return;

    const intervalSeconds = slot?.slideshowSpeedSeconds || 4;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slideshowImages.length);
    }, intervalSeconds * 1000);

    return () => clearInterval(timer);
  }, [mediaType, slideshowImages.length, slot?.slideshowSpeedSeconds]);

  // Handle Video
  if (mediaType === 'video' && slot?.videoUrl) {
    const videoUrl = slot.videoUrl.trim();
    const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
    const isVimeo = videoUrl.includes('vimeo.com');

    if (isYouTube) {
      let embedUrl = videoUrl;
      const ytIdMatch = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (ytIdMatch && ytIdMatch[1]) {
        embedUrl = `https://www.youtube.com/embed/${ytIdMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${ytIdMatch[1]}&controls=0&showinfo=0`;
      }
      return (
        <div className={`relative w-full h-full overflow-hidden bg-slate-900 ${className}`}>
          <iframe
            src={embedUrl}
            title="Promotional Video"
            className="w-full h-full border-0 pointer-events-none object-cover scale-125"
            allow="autoplay; encrypted-media"
          />
          <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
            <Play className="w-2.5 h-2.5 fill-current" /> Video
          </div>
        </div>
      );
    }

    if (isVimeo) {
      const vimeoMatch = videoUrl.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|)(\d+)(?:$|\/|\?)/);
      const vimeoId = vimeoMatch ? vimeoMatch[1] : '';
      return (
        <div className={`relative w-full h-full overflow-hidden bg-slate-900 ${className}`}>
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&loop=1&muted=1&background=1`}
            title="Promotional Video"
            className="w-full h-full border-0 pointer-events-none object-cover"
            allow="autoplay; fullscreen"
          />
        </div>
      );
    }

    // Direct MP4 / WebM video file
    return (
      <div className={`relative w-full h-full overflow-hidden bg-slate-900 group ${className}`}>
        <video
          src={videoUrl}
          poster={slot.videoPoster || slot.imageUrl}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover"
        />
        {/* Subtle sound control button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsMuted(!isMuted);
          }}
          className="absolute bottom-2.5 left-2.5 bg-black/60 hover:bg-black/80 backdrop-blur-md p-1.5 rounded-full text-white transition-colors cursor-pointer z-10"
          title={isMuted ? 'Unmute video' : 'Mute video'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#FD9302]" />}
        </button>

        <div className="absolute top-2.5 right-2.5 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] font-bold text-white uppercase tracking-wider flex items-center gap-1 pointer-events-none">
          <Play className="w-2.5 h-2.5 fill-current" /> Live
        </div>
      </div>
    );
  }

  // Handle Slideshow
  if (mediaType === 'slideshow') {
    const activeImage = slideshowImages[currentSlideIndex] || fallbackImage;
    return (
      <div className={`relative w-full h-full overflow-hidden bg-slate-100 ${className}`}>
        {slideshowImages.map((imgUrl, idx) => (
          <img
            key={idx}
            src={imgUrl}
            alt={slot?.imageAlt || `SpoteraDeals Slide ${idx + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
              idx === currentSlideIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          />
        ))}

        {/* Slideshow Progress Dots */}
        {slideshowImages.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full z-10 pointer-events-none">
            {slideshowImages.map((_, dotIdx) => (
              <span
                key={dotIdx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  dotIdx === currentSlideIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Default: Single Image
  const singleUrl = imageError ? fallbackImage : (slot?.imageUrl || fallbackImage);

  return (
    <div className={`relative w-full h-full overflow-hidden bg-slate-100 ${className}`}>
      <img
        src={singleUrl}
        alt={slot?.imageAlt || 'SpoteraDeals UAE Family Experience'}
        onError={() => setImageError(true)}
        className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
      />
    </div>
  );
};
