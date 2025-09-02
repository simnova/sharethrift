import { useQuery, gql } from '@apollo/client';
import { ListingImageGallery } from './listing-image-gallery';

const GET_LISTING_IMAGES = gql`
  query ViewListingImageGalleryGetImages($listingId: ObjectID!) {
    itemListing(id: $listingId) {
      images
      title
    }
  }
`;

interface ListingImagesResponse {
  itemListing: {
    images: string[];
    title: string;
  };
}

interface ListingImageGalleryContainerProps {
  listingId: string;
  className?: string;
}

export default function ListingImageGalleryContainer({ listingId, className }: ListingImageGalleryContainerProps) {
  const { data, loading, error } = useQuery<ListingImagesResponse>(
    GET_LISTING_IMAGES,
    {
      variables: { listingId },
    }
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading images</div>;
  if (!data?.itemListing) return null;

  return (
    <ListingImageGallery
      images={data.itemListing.images || []}
      title={data.itemListing.title}
      className={className}
    />
  );
}

