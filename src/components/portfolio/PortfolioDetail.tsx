
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPortfolioImages, checkImageExists } from '@/lib/portfolio-utils';
import ImageLightbox from './ImageLightbox';
import { ChevronLeft } from 'lucide-react';

export interface PortfolioImage {
  url: string;
  caption?: string;
  width?: number;
  height?: number;
}

const PortfolioDetail = () => {
  const { folderName } = useParams<{ folderName: string }>();
  const navigate = useNavigate();
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const loadImages = async () => {
      if (!folderName) {
        setError("No folder specified");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const fetchedImages = await getPortfolioImages(folderName);
        setImages(fetchedImages);
        setLoading(false);
      } catch (err) {
        console.error("Error loading portfolio images:", err);
        setError("Failed to load images. Please try again.");
        setLoading(false);
      }
    };

    loadImages();
  }, [folderName]);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleGoBack = () => {
    navigate('/portfolio');
  };

  const capitalizeFolder = (name: string): string => {
    return name.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-t-4 border-primary border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-medium text-red-500 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button 
            onClick={handleGoBack}
            className="px-6 py-3 bg-primary text-white rounded-md hover:bg-opacity-90 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-6 md:px-12 transition-all duration-500 animate-fade-in">
      <button 
        onClick={handleGoBack}
        className="flex items-center text-primary mb-8 px-4 py-2 rounded-full hover:bg-gray-100 transition-all"
      >
        <ChevronLeft className="w-5 h-5 mr-2" />
        <span>Back to Portfolio</span>
      </button>
      
      <header className="mb-12 text-center">
        <span className="inline-block px-4 py-1 rounded-full bg-gray-100 text-sm font-medium text-gray-600 mb-4">Portfolio</span>
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">
          {folderName ? capitalizeFolder(folderName) : 'Portfolio Gallery'}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Browse our curated collection of {folderName ? capitalizeFolder(folderName) : 'portfolio'} work.
        </p>
      </header>
      
      {images.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500">No images found in this collection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <div 
              key={index}
              className="group relative overflow-hidden rounded-xl aspect-[4/3] cursor-pointer animate-fade-in transition-transform duration-300 hover:scale-[1.02]"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => openLightbox(index)}
            >
              <img 
                src={image.url} 
                alt={image.caption || `Gallery image ${index + 1}`}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-[1.05]"
                loading="lazy"
              />
              {image.caption && (
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4 w-full">
                    <h3 className="text-white font-medium text-lg">{image.caption}</h3>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      <ImageLightbox 
        images={images}
        currentImage={images[currentImageIndex] || null}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onNext={goToNextImage}
        onPrevious={goToPreviousImage}
      />
    </div>
  );
};

export default PortfolioDetail;
