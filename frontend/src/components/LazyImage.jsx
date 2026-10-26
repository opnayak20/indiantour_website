import React, { useState, useRef, useEffect } from 'react';

/**
 * High-performance LazyImage component:
 * - Employs native browser loading="lazy" + decoding="async"
 * - Progressive IntersectionObserver pre-warm
 * - Lightweight skeleton placeholder while loading to eliminate Layout Shift (CLS = 0)
 * - Immediate display for eager or cached images
 * - Local fallback placeholder on error
 */
export default function LazyImage({
  src,
  alt = '',
  className = '',
  style = {},
  aspectRatio,
  placeholderColor = '#f3f4f6',
  fallbackSrc = '/hero-buddha.jpg',
  fetchPriority = 'auto',
  eager = false,
  onClick,
  ...rest
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [inView, setInView] = useState(eager);
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    if (eager) {
      setInView(true);
      return;
    }

    if (!containerRef.current) return;

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
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    } else {
      setInView(true);
    }
  }, [eager]);

  // Synchronously check if image is already loaded from cache upon mount/update
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [inView, src, hasError]);

  const currentSrc = hasError ? (fallbackSrc || '/hero-buddha.jpg') : (src || fallbackSrc || '/hero-buddha.jpg');

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      className={`relative overflow-hidden ${className}`}
      style={{
        backgroundColor: placeholderColor,
        aspectRatio: aspectRatio || undefined,
        ...style
      }}
    >
      {/* Subtle pulsing skeleton shimmer only until image loads and not in eager mode */}
      {!isLoaded && !eager && (
        <div
          className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200/50 to-gray-100 animate-pulse pointer-events-none"
          aria-hidden="true"
        />
      )}

      {inView && (
        <img
          ref={imgRef}
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
            isLoaded || eager ? 'opacity-100' : 'opacity-90'
          }`}
          {...rest}
        />
      )}
    </div>
  );
}
