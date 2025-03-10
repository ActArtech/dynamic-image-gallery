
import React, { useEffect, useRef } from 'react';
import { PortfolioImage } from './PortfolioDetail';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageLightboxProps {
  images: PortfolioImage[];
  currentImage: PortfolioImage | null;
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  currentImage,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrevious
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Lock body scroll when lightbox is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        onNext();
      } else if (e.key === 'ArrowLeft') {
        onPrevious();
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onNext, onPrevious]);

  if (!isOpen || !currentImage) return null;

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 bg-black bg-opacity-90 z-[100] flex flex-col justify-center items-center lightbox-overlay"
      onClick={(e) => {
        if (e.target === overlayRef.current) {
          onClose();
        }
      }}
    >
      <div className="relative max-w-5xl max-h-[90vh] lightbox-content animate-scale-in overflow-y-auto">
        <img 
          src={currentImage.url} 
          alt={currentImage.caption || 'Portfolio image'} 
          className="max-h-[80vh] max-w-full object-contain rounded"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full backdrop-blur-md bg-black/50 text-white hover:bg-black/70 transition-all duration-300 transform hover:scale-105"
          aria-label="Close lightbox"
        >
          <X className="w-6 h-6" />
        </button>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            onPrevious();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full backdrop-blur-md bg-black/50 text-white hover:bg-black/70 transition-all duration-300 transform hover:scale-105"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full backdrop-blur-md bg-black/50 text-white hover:bg-black/70 transition-all duration-300 transform hover:scale-105"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {currentImage.caption && (
        <div className="mt-6 text-white text-center max-w-xl px-4 animate-fade-in">
          <p className="text-xl font-light">{currentImage.caption}</p>
        </div>
      )}

      <div className="absolute bottom-6 text-white text-sm bg-black/50 px-4 py-1 rounded-full backdrop-blur-md">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};

export default ImageLightbox;
