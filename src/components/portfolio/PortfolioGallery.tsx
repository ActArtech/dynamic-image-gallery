
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPortfolioFolders, getPortfolioThumbnails } from '@/lib/portfolio-utils';

interface GalleryItemProps {
  folderName: string;
  thumbnails: string[];
}

const GalleryItem: React.FC<GalleryItemProps> = ({ folderName, thumbnails }) => {
  const formatTitle = (name: string): string => {
    return name.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Link 
      to={`/portfolio/${folderName}`} 
      className="group block relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden">
        {thumbnails.length > 0 ? (
          <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-1">
            {thumbnails.slice(0, 4).map((thumbnail, i) => (
              <div key={i} className="relative overflow-hidden">
                <img 
                  src={thumbnail} 
                  alt={`${folderName} thumbnail ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No images available</p>
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 w-full p-6">
          <h3 className="text-white text-xl font-medium mb-2">{formatTitle(folderName)}</h3>
          <div className="inline-flex items-center text-white/80 text-sm">
            <span>View gallery</span>
            <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

const PortfolioGallery = () => {
  const [folders, setFolders] = useState<string[]>([]);
  const [folderThumbnails, setFolderThumbnails] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFolders = async () => {
      try {
        setLoading(true);
        const portfolioFolders = await getPortfolioFolders();
        setFolders(portfolioFolders);
        
        // Load thumbnails for each folder
        const thumbnailsMap: Record<string, string[]> = {};
        
        for (const folder of portfolioFolders) {
          const thumbnails = await getPortfolioThumbnails(folder);
          thumbnailsMap[folder] = thumbnails;
        }
        
        setFolderThumbnails(thumbnailsMap);
        setLoading(false);
      } catch (err) {
        console.error("Error loading portfolio folders:", err);
        setError("Failed to load portfolio categories. Please try again.");
        setLoading(false);
      }
    };

    loadFolders();
  }, []);

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
          <Link 
            to="/"
            className="px-6 py-3 bg-primary text-white rounded-md hover:bg-opacity-90 transition-all"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-6 md:px-12 animate-fade-in">
      <header className="mb-16 text-center">
        <span className="inline-block px-4 py-1 rounded-full bg-gray-100 text-sm font-medium text-gray-600 mb-4">Our Work</span>
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">Portfolio Gallery</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Browse our collection of work organized by category. Click on any category to explore the full gallery.
        </p>
      </header>
      
      {folders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500">No portfolio categories found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {folders.map((folder, index) => (
            <div 
              key={folder} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <GalleryItem 
                folderName={folder} 
                thumbnails={folderThumbnails[folder] || []} 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortfolioGallery;
