import bikeListingImg from '@sthrift/ui-sharethrift-components/src/assets/item-images/bike-listing.png';
import { Carousel, Card } from 'antd';

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
    <Carousel arrows dots swipeToSlide className={className} style={{ width: 450, height: 500 }}>
      {images.map((imgSrc: string, idx: number) => (
        <Card
          key={idx}
          bodyStyle={{ padding: 0, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 500, width: 450, boxSizing: 'border-box' }}
          bordered={false}
          style={{ boxShadow: 'none', background: 'transparent', height: 500, width: 450, boxSizing: 'border-box' }}
        >
          <img
            src={imgSrc}
            alt={title}
            style={{ height: 'calc(100% - 2px)', width: 'calc(100% - 2px)', borderRadius: 2, border: '0.5px solid var(--color-foreground-2)', objectFit: 'cover', display: 'block', boxSizing: 'border-box' }}
          />
        </Card>
      ))}
    </Carousel>
  );
}