
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
    'branding': 10,
    'webdev': 8,
    'web-design': 6,
    'illustrations': 6,
    'ui-ux': 6,
    'photography': 6
  };

  const imageCount = maxImages[folderName] || 4;

  // For demo purposes, we're simulating different images for different folders
  try {
    let images: PortfolioImage[] = [];
    
    if (folderName === 'branding') {
      // Branding images with proper directory structure
      const filenames = [
        '3ee64150cd5a154a98f8df7298eaf3c3.jpg',
        '479003a91f7993ecfeff43fcaa4cf110.jpg',
        '7afac5b84dad8005a4e982fc29a60e63.jpg',
        '9131c0dc5c2507215206d23a6355cad8.jpg',
        '9d75fb077ac6cd20ed1db86059911e19.jpg',
        'cbb40d1aa750ff0f87c43fc4302f975f.jpg',
        'cd28d368c9683d6acff428997add64e4.jpg',
        'cf54719ab56e6fff11f3b69f53b588f1.jpg',
        'd02f11ca32bdfad81fb14c13dc17a7cd.jpg',
        'dd04fe4a9078e0ab4eedbb73b252698e.jpg'
      ];
      
      const captions = [
        "Brand identity design",
        "Logo variations",
        "Typography system",
        "Color palette exploration",
        "Brand guidelines",
        "Business card design",
        "Letterhead template",
        "Social media assets",
        "Brand collateral",
        "Marketing materials"
      ];
      
      images = filenames.map((filename, index) => ({
        url: `/images/portfolio/${folderName}/${filename}`,
        caption: captions[index],
        width: 800,
        height: 600
      }));
    } 
    else if (folderName === 'webdev') {
      // Web development images - using proper directory structure
      const filenames = [
        'portfolio-website.jpg',
        'ecommerce-platform.jpg',
        'admin-dashboard.jpg',
        'responsive-design.jpg',
        'landing-page.jpg',
        'web-application.jpg',
        'interactive-form.jpg',
        'api-integration.jpg'
      ];
      
      const captions = [
        "Portfolio website design",
        "E-commerce platform", 
        "Admin dashboard interface",
        "Mobile responsive layout",
        "Landing page optimization",
        "Web application UI",
        "Interactive form design",
        "API integration showcase"
      ];
      
      // Map filenames to their full URLs
      images = filenames.map((filename, index) => ({
        url: `/images/portfolio/${folderName}/${filename}`,
        caption: captions[index],
        width: 800,
        height: 600
      }));
    }
    else if (folderName === 'web-design') {
      // Web design images in their own directory
      const filenames = Array.from({ length: imageCount }, (_, i) => `design-${i + 1}.jpg`);
      
      const captions = [
        "Responsive design system",
        "Website mockup", 
        "Mobile app interface",
        "E-commerce design",
        "Landing page design",
        "Corporate website"
      ];
      
      images = filenames.map((filename, index) => ({
        url: `/images/portfolio/${folderName}/${filename}`,
        caption: captions[index % captions.length],
        width: 800,
        height: 600
      }));
    }
    else if (folderName === 'illustrations') {
      // Illustration images in their own directory
      const filenames = Array.from({ length: imageCount }, (_, i) => `illustration-${i + 1}.jpg`);
      
      const captions = [
        "Character design",
        "Digital illustration", 
        "Editorial illustration",
        "Concept art",
        "Vector graphics",
        "Hand-drawn sketch"
      ];
      
      images = filenames.map((filename, index) => ({
        url: `/images/portfolio/${folderName}/${filename}`,
        caption: captions[index % captions.length],
        width: 800,
        height: 600
      }));
    }
    else if (folderName === 'ui-ux') {
      // UI/UX images in their own directory
      const filenames = Array.from({ length: imageCount }, (_, i) => `ui-ux-${i + 1}.jpg`);
      
      const captions = [
        "Mobile app UI",
        "User flow diagram", 
        "Interactive wireframe",
        "Dashboard design",
        "Design system components",
        "User research findings"
      ];
      
      images = filenames.map((filename, index) => ({
        url: `/images/portfolio/${folderName}/${filename}`,
        caption: captions[index % captions.length],
        width: 800,
        height: 600
      }));
    }
    else if (folderName === 'photography') {
      // Photography images in their own directory
      const filenames = Array.from({ length: imageCount }, (_, i) => `photo-${i + 1}.jpg`);
      
      const captions = [
        "Portrait photography",
        "Landscape shot", 
        "Product photography",
        "Event coverage",
        "Architectural photography",
        "Abstract composition"
      ];
      
      images = filenames.map((filename, index) => ({
        url: `/images/portfolio/${folderName}/${filename}`,
        caption: captions[index % captions.length],
        width: 800,
        height: 600
      }));
    }
    else {
      // Fallback for any other folders - following folder structure
      images = Array.from({ length: imageCount }, (_, i) => ({
        url: `/images/portfolio/${folderName}/image-${i + 1}.jpg`,
        caption: `${capitalize(folderName)} project ${i + 1}`,
        width: 800,
        height: 600
      }));
    }

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

  // Each folder has its own distinct set of thumbnails
  if (folderName === 'branding') {
    // Branding thumbnails
    const thumbnails = [
      '3ee64150cd5a154a98f8df7298eaf3c3.jpg',
      '479003a91f7993ecfeff43fcaa4cf110.jpg',
      '7afac5b84dad8005a4e982fc29a60e63.jpg',
      '9131c0dc5c2507215206d23a6355cad8.jpg',
    ];
    
    return thumbnails.map(filename => `/images/portfolio/${folderName}/${filename}`);
  } else if (folderName === 'webdev') {
    // Web development thumbnails
    const thumbnails = [
      'portfolio-website.jpg',
      'ecommerce-platform.jpg',
      'admin-dashboard.jpg',
      'responsive-design.jpg',
    ];
    
    return thumbnails.map(filename => `/images/portfolio/${folderName}/${filename}`);
  } else if (folderName === 'web-design') {
    // Web design thumbnails
    return Array.from({ length: count }, (_, i) => 
      `/images/portfolio/${folderName}/design-${i + 1}.jpg`
    );
  } else if (folderName === 'illustrations') {
    // Illustration thumbnails
    return Array.from({ length: count }, (_, i) => 
      `/images/portfolio/${folderName}/illustration-${i + 1}.jpg`
    );
  } else if (folderName === 'ui-ux') {
    // UI/UX thumbnails
    return Array.from({ length: count }, (_, i) => 
      `/images/portfolio/${folderName}/ui-ux-${i + 1}.jpg`
    );
  } else if (folderName === 'photography') {
    // Photography thumbnails
    return Array.from({ length: count }, (_, i) => 
      `/images/portfolio/${folderName}/photo-${i + 1}.jpg`
    );
  } else {
    // Default thumbnails for other categories, following the folder structure
    return Array.from({ length: count }, (_, i) => 
      `/images/portfolio/${folderName}/image-${i + 1}.jpg`
    );
  }
};

const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
