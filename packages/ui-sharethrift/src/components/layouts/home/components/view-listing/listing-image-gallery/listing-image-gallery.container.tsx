// import { useQuery } from '@apollo/client';
// import GET_LISTING_IMAGES from './listing-image-gallery.graphql';
import { ListingImageGallery } from './listing-image-gallery';

interface ListingImageGalleryContainerProps {
  images: string[];
  title: string;
  className?: string;
}

export default function ListingImageGalleryContainer({ images, title, className }: ListingImageGalleryContainerProps) {
  // TODO: Replace with real GraphQL query when backend is ready. Query should match ItemListing model.
  return (
    <ListingImageGallery
      images={images}
      title={title}
      className={className}
    />
  );
}

