
import { PortfolioImage } from '@/components/portfolio/PortfolioDetail';

// Define folders that are available in the portfolio
export const getPortfolioFolders = (): Promise<string[]> => {
  // In a real implementation, this would use fs to read directory contents
  // For this demo, we'll use hardcoded values
  const folders = ["branding", "webdev", "web-design", "illustrations", "ui-ux", "photography"];
  console.log("Returning portfolio folders:", folders);
  return Promise.resolve(folders);
};

// Function to get portfolio images for the detail view
export const getPortfolioImages = async (folderName: string): Promise<PortfolioImage[]> => {
  console.log(`Loading images for folder: ${folderName}`);

  // Define max images per folder for the demo
  const maxImages: Record<string, number> = {
    'branding': 6,
    'webdev': 5,
    'web-design': 4,
    'illustrations': 3,
    'ui-ux': 4,
    'photography': 5
  };

  const imageCount = maxImages[folderName] || 4;
  
  // Unsplash placeholder images that will always work
  const placeholderImages = [
    'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    'https://images.unsplash.com/photo-1518770660439-4636190af475',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'
  ];
  
  // Generate demo captions based on folder type
  const getCaptions = (folder: string, count: number): string[] => {
    const captionSets: Record<string, string[]> = {
      'branding': [
        "Brand identity design",
        "Logo variations",
        "Typography system",
        "Color palette exploration",
        "Brand guidelines",
        "Business card design"
      ],
      'webdev': [
        "Portfolio website design",
        "E-commerce platform", 
        "Admin dashboard interface",
        "Mobile responsive layout",
        "Web application UI"
      ],
      'web-design': [
        "Responsive design system",
        "Website mockup", 
        "Mobile app interface",
        "E-commerce design"
      ],
      'illustrations': [
        "Digital illustration", 
        "Editorial illustration",
        "Concept art"
      ],
      'ui-ux': [
        "Mobile app UI",
        "User flow diagram", 
        "Interactive wireframe",
        "Dashboard design"
      ],
      'photography': [
        "Portrait photography",
        "Landscape shot", 
        "Product photography",
        "Architectural photography",
        "Abstract composition"
      ]
    };
    
    return captionSets[folder] || Array.from({ length: count }, (_, i) => `${capitalize(folder)} project ${i + 1}`);
  };

  try {
    // Get appropriate captions for this folder
    const captions = getCaptions(folderName, imageCount);
    
    // Create image objects using placeholder images (that will always work)
    // In a production app, you would check for actual uploaded images first
    const images: PortfolioImage[] = Array.from({ length: imageCount }, (_, i) => ({
      url: placeholderImages[i % placeholderImages.length],
      caption: captions[i % captions.length],
      width: 800,
      height: 600
    }));

    console.log(`Generated ${images.length} images for ${folderName}:`, images);
    return images;
  } catch (error) {
    console.error(`Error generating images for ${folderName}:`, error);
    return [];
  }
};

// Function to check if an image exists
export const checkImageExists = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // If it's an Unsplash URL, we know it exists
    if (url.includes('unsplash.com')) {
      resolve(true);
      return;
    }
    
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => {
      console.log(`Failed to load thumbnail: ${url}`);
      resolve(false);
    };
    img.src = url;
  });
};

// Function to get portfolio thumbnails for the gallery view
export const getPortfolioThumbnails = async (folderName: string, count: number = 4): Promise<string[]> => {
  console.log(`Loading thumbnails for folder: ${folderName}`);

  // Use Unsplash placeholder images that will always work
  const placeholderImages = [
    'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    'https://images.unsplash.com/photo-1518770660439-4636190af475',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6'
  ];
  
  // Return a set of thumbnails (in a real app, these would be from actual uploads)
  return placeholderImages.slice(0, count);
};

const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
