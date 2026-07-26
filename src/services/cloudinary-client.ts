import { CLOUDINARY_CONFIG } from '../config/cloudinary.js';

export interface GalleryItem {
  id: string;
  url: string;
  thumbUrl: string;
  category: string;
  title: string;
  location: string;
  alt: string;
  width?: number;
  height?: number;
  isWide?: boolean;
  isTall?: boolean;
}

export async function fetchGalleryItems(): Promise<GalleryItem[]> {
  const { cloudName, galleryTag } = CLOUDINARY_CONFIG;

  if (!cloudName) {
    console.warn('Cloudinary cloud name is missing. Falling back to local static gallery.');
    return getFallbackGallery();
  }

  try {
    // Cloudinary client-side asset lists (JSON)
    const response = await fetch(
      `https://res.cloudinary.com/${cloudName}/image/list/${galleryTag}.json`,
    );

    if (!response.ok) {
      throw new Error(`Cloudinary fetch failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.resources || !Array.isArray(data.resources)) {
      throw new Error('Invalid Cloudinary response format');
    }

    return data.resources.map((res: any): GalleryItem => {
      const customContext = res.context?.custom || {};

      // Auto-determine spans based on natural image orientation for masonry grid
      const aspectRatio = res.width / res.height;
      const isWide = aspectRatio > 1.2;
      const isTall = aspectRatio < 0.8;

      return {
        id: res.public_id,
        // Base auto-format, auto-quality, max width 1200 for lightbox
        url: `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_1200/${res.public_id}.${res.format}`,
        // Thumbnail with max width 600
        thumbUrl: `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_600/${res.public_id}.${res.format}`,
        category: customContext.category || 'culture',
        title: customContext.title || 'Untitled',
        location: customContext.location || 'Sri Lanka',
        alt: customContext.alt || 'Sri Lanka scenery',
        width: res.width,
        height: res.height,
        isWide,
        isTall,
      };
    });
  } catch (error) {
    console.warn(
      'Failed to load gallery from Cloudinary. Falling back to local static gallery.',
      error,
    );
    return getFallbackGallery();
  }
}

function getFallbackGallery(): GalleryItem[] {
  return [
    {
      id: 'sigiriya',
      url: 'images/gallery/sigiriya.webp',
      thumbUrl: 'images/gallery/sigiriya.webp',
      category: 'heritage',
      title: 'Sigiriya Rock Fortress',
      location: 'Central Province',
      alt: 'Sigiriya rock fortress rising above the forest',
      isTall: true,
    },
    {
      id: 'elephant',
      url: 'images/gallery/elephant.webp',
      thumbUrl: 'images/gallery/elephant.webp',
      category: 'wildlife',
      title: 'Wild Encounters',
      location: 'Sri Lanka',
      alt: 'Sri Lankan elephant in its natural habitat',
    },
    {
      id: 'tea_plantation',
      url: 'images/gallery/tea_plantation.webp',
      thumbUrl: 'images/gallery/tea_plantation.webp',
      category: 'mountains',
      title: 'Hill Country Tea',
      location: 'Central Highlands',
      alt: 'Green tea plantations across the Sri Lankan hill country',
      isWide: true,
    },
    {
      id: 'train',
      url: 'images/gallery/train.webp',
      thumbUrl: 'images/gallery/train.webp',
      category: 'culture',
      title: 'Scenic Rail Journey',
      location: 'Hill Country',
      alt: "Scenic train travelling through Sri Lanka's hill country",
    },
    {
      id: 'temple',
      url: 'images/gallery/temple.webp',
      thumbUrl: 'images/gallery/temple.webp',
      category: 'temples',
      title: 'Sacred Heritage',
      location: 'Sri Lanka',
      alt: 'Historic Sri Lankan temple architecture',
    },
    {
      id: 'beach',
      url: 'images/gallery/beach.webp',
      thumbUrl: 'images/gallery/beach.webp',
      category: 'beaches',
      title: 'Island Coast',
      location: 'Southern Coast',
      alt: 'Golden tropical beach on the Sri Lankan coast',
      isWide: true,
    },
  ];
}
