import { Carousel, Card } from 'antd';

export interface ListingImageGalleryProps {
  images: string[];
  title: string;
  className?: string;
}

export function ListingImageGallery({ images, title, className = '' }: ListingImageGalleryProps) {
  return (
    <Carousel arrows dots swipeToSlide className={className} style={{ width: 450, height: 500 }}>
      {images.map((imgSrc: string) => (
        <Card
          key={imgSrc}
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