import { Carousel } from 'antd';
import './listing-image-gallery.overrides.css';

export interface ListingImageGalleryProps {
  images: string[];
  title: string;
  className?: string;
}

export function ListingImageGallery({ images, title, className = '' }: ListingImageGalleryProps) {
  return (
    <div
      className={className}
      style={{
        width: '100%',
        maxWidth: 450,
        aspectRatio: '9/10',
        margin: '0 auto',
        padding: 0,
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
  <style>{`
        .listing-gallery-responsive {
          width: 100% !important;
          max-width: 450px !important;
          aspect-ratio: 9/10 !important;
          height: auto !important;
          min-height: 300px !important;
          padding-bottom: 12px !important;
        }
      `}</style>
      <Carousel arrows dots swipeToSlide style={{ width: '100%', height: '100%' }} className="listing-gallery-responsive">
        {images.map((imgSrc: string) => (
          <div key={imgSrc} style={{ width: '100%', height: '100%', aspectRatio: '9/10', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src={imgSrc}
              alt={title}
              style={{
                width: '100%',
                height: '100%',
                aspectRatio: '9/10',
                maxWidth: 450,
                maxHeight: 500,
                borderRadius: 2,
                border: '0.5px solid var(--color-foreground-2)',
                objectFit: 'cover',
                display: 'block',
                boxSizing: 'border-box',
                margin: '0 auto',
              }}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
}