import React, { useState, useRef, useEffect } from 'react';

/**
 * High-performance LazyImage component:
 * - Employs native browser loading="lazy" + decoding="async"
 * - Progressive IntersectionObserver pre-warm
 * - Lightweight skeleton placeholder while loading to eliminate Layout Shift (CLS = 0)
 * - Smooth opacity transition on load
 * - Fallback placeholder on error
 */
export default function LazyImage({
  src,
  alt = '',
  className = '',
  style = {},
  aspectRatio,
  placeholderColor = '#f3f4f6',
  fallbackSrc = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  fetchPriority = 'auto',
  eager = false,
  onClick,
  ...rest
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [inView, setInView] = useState(eager);
  const imgRef = useRef(null);

  useEffect(() => {
    if (eager) {
      setInView(true);
      return;
    }

    if (!imgRef.current) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setInView(true);
              observer.disconnect();
            }
          });
        },
        { rootMargin: '300px 0px 300px 0px' } // Pre-load 300px before scrolling into viewport
      );
      observer.observe(imgRef.current);
      return () => observer.disconnect();
    } else {
      setInView(true);
    }
  }, [eager]);

  const currentSrc = hasError ? fallbackSrc : src;

  return (
    <div
      ref={imgRef}
      onClick={onClick}
      className={`relative overflow-hidden ${className}`}
      style={{
        backgroundColor: placeholderColor,
        aspectRatio: aspectRatio || undefined,
        contain: 'paint layout',
        ...style
      }}
    >
      {/* Subtle pulsing skeleton shimmer until loaded */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200/60 to-gray-100 animate-pulse pointer-events-none"
          aria-hidden="true"
        />
      )}

      {inView && (
        <img
          src={currentSrc}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={fetchPriority}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            if (!hasError) {
              setHasError(true);
            } else {
              setIsLoaded(true);
            }
          }}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          {...rest}
        />
      )}
    </div>
  );
}
