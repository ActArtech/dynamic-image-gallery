
import React, { useEffect, useRef, useState } from 'react';
import { PortfolioImage } from './PortfolioDetail';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  const contentRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  
  // For wheel scroll debouncing
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

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

  // Reset scroll position when changing images
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [currentIndex]);

  // Handle wheel event for scrolling through images
  const handleWheel = (e: React.WheelEvent) => {
    if (isScrolling) return;
    
    // Check if content is scrollable vertically
    const scrollableContent = contentRef.current;
    const imageContainer = imageContainerRef.current;
    
    if (!scrollableContent || !imageContainer) return;
    
    const isContentScrollable = 
      scrollableContent.scrollHeight > scrollableContent.clientHeight;
    
    // If content is scrollable and not at top/bottom, allow normal scrolling
    if (isContentScrollable) {
      const isAtTop = scrollableContent.scrollTop === 0;
      const isAtBottom = 
        scrollableContent.scrollTop + scrollableContent.clientHeight >= 
        scrollableContent.scrollHeight - 5; // Small tolerance
      
      // If at top and scrolling up OR at bottom and scrolling down, navigate images
      if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
        e.preventDefault();
        if (e.deltaY > 0) {
          onNext();
        } else {
          onPrevious();
        }
        
        // Debounce scrolling to prevent rapid image changes
        setIsScrolling(true);
        if (scrollTimeout.current) {
          clearTimeout(scrollTimeout.current);
        }
        scrollTimeout.current = setTimeout(() => {
          setIsScrolling(false);
        }, 300); // 300ms delay between scroll actions
      }
    } else {
      // If content is not scrollable, always navigate with wheel
      e.preventDefault();
      if (e.deltaY > 0) {
        onNext();
      } else {
        onPrevious();
      }
      
      // Debounce scrolling
      setIsScrolling(true);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false);
      }, 300);
    }
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  if (!isOpen || !currentImage) return null;

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 bg-black bg-opacity-90 z-[100] flex flex-col justify-center items-center"
      onClick={(e) => {
        if (e.target === overlayRef.current) {
          onClose();
        }
      }}
      data-testid="lightbox-overlay"
    >
      <div 
        ref={contentRef}
        className="relative w-full max-w-5xl h-[calc(100vh-140px)] flex flex-col items-center"
        onWheel={handleWheel}
      >
        <ScrollArea className="w-full h-full rounded-md">
          <div 
            ref={imageContainerRef}
            className="flex justify-center p-4"
          >
            <img 
              src={currentImage.url} 
              alt={currentImage.caption || 'Portfolio image'} 
              className="max-w-full object-contain animate-scale-in"
              onError={(e) => {
                console.log(`Lightbox image failed to load: ${currentImage.url}`);
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          </div>
        </ScrollArea>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full backdrop-blur-md bg-black/50 text-white hover:bg-black/70 transition-all duration-300 transform hover:scale-105 z-50"
          aria-label="Close lightbox"
        >
          <X className="w-6 h-6" />
        </button>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            onPrevious();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full backdrop-blur-md bg-black/50 text-white hover:bg-black/70 transition-all duration-300 transform hover:scale-105 z-50"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full backdrop-blur-md bg-black/50 text-white hover:bg-black/70 transition-all duration-300 transform hover:scale-105 z-50"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {currentImage.caption && (
        <div className="mt-4 text-white text-center max-w-xl px-4 animate-fade-in">
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
