import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
  images: string[];
  titles: string[];
  initialIndex: number;
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ images, titles, initialIndex, onClose }) => {
  const [index, setIndex] = useState(initialIndex);

  const handleNext = useCallback(() => {
    setIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, handleNext, handlePrev]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(3, 7, 18, 0.95)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '30px',
          right: '30px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#fff',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'var(--transition-smooth)',
        }}
        className="lightbox-close"
      >
        <X size={24} />
      </button>

      {/* Navigation Left */}
      {images.length > 1 && (
        <button
          onClick={handlePrev}
          style={{
            position: 'absolute',
            left: '3vw',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'var(--transition-smooth)',
            zIndex: 10,
          }}
          className="lightbox-nav"
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {/* Main Image and Info */}
      <div
        style={{
          maxWidth: '85vw',
          maxHeight: '75vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
        }}
      >
        <img
          src={images[index]}
          alt={titles[index]}
          style={{
            maxWidth: '100%',
            maxHeight: '70vh',
            objectFit: 'contain',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5), 0 0 20px rgba(37,99,235,0.2)',
            border: '1px solid rgba(255,255,255,0.08)',
            animation: 'fadeIn 0.3s ease-out',
          }}
        />
        <div style={{ textAlign: 'center' }}>
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.4rem',
              color: '#fff',
              marginBottom: '5px',
            }}
          >
            {titles[index]}
          </h3>
          <p style={{ color: 'var(--text-gray)', fontSize: '0.95rem' }}>
            Image {index + 1} of {images.length}
          </p>
        </div>
      </div>

      {/* Navigation Right */}
      {images.length > 1 && (
        <button
          onClick={handleNext}
          style={{
            position: 'absolute',
            right: '3vw',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'var(--transition-smooth)',
            zIndex: 10,
          }}
          className="lightbox-nav"
        >
          <ChevronRight size={28} />
        </button>
      )}

      <style>{`
        .lightbox-close:hover, .lightbox-nav:hover {
          background: var(--primary) !important;
          border-color: var(--secondary) !important;
          transform: scale(1.1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};
