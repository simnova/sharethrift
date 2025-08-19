import { Image } from 'antd';
import bikeListingImg from '@sthrift/ui-sharethrift-components/src/assets/item-images/bike-listing.png';

export interface ListingImageGalleryProps {
  images: string[];
  title: string;
  className?: string;
}

export function ListingImageGallery({ title, className = '' }: { title: string; className?: string }) {
  // Always use the city bike image from assets
  const selectedImage = bikeListingImg;

  return (
    <div className={className}>
      {/* Main Image */}
      <div className="aspect-[386/440] bg-gray-200 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
        <Image
          src={selectedImage}
          alt={`${title} - City Bike`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnails - Desktop Layout */}
  {/* No thumbnails or counter since only one image is used */}
    </div>
  );
}