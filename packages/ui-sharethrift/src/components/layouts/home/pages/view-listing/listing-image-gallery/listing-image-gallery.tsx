import bikeListingImg from '@sthrift/ui-sharethrift-components/src/assets/item-images/bike-listing.png';
import './listing-image-gallery.css';
import { Carousel } from 'antd';

export interface ListingImageGalleryProps {
  images: string[];
  title: string;
  className?: string;
}

export function ListingImageGallery({ title, className = '' }: { title: string; className?: string }) {
  // Use images prop if provided, else default to 4 bike images
  const images = Array.isArray(arguments[0]?.images) && arguments[0]?.images.length > 0
    ? arguments[0].images
    : [bikeListingImg, bikeListingImg, bikeListingImg, bikeListingImg];

  return (
    <div className={className}>
      <Carousel dots swipeToSlide style={{ width: 450, height: 500 }}>
        {images.map((imgSrc, idx) => (
          <div key={idx} style={{ width: 450, height: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src={imgSrc}
              alt={`${title} - Image ${idx + 1}`}
              style={{ height: 500, width: 450, borderRadius: 2, border: '0.5px solid var(--color-foreground-2)', objectFit: 'cover', display: 'block' }}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
}