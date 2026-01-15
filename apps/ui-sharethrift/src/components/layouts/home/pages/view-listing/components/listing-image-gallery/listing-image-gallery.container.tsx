import { useQuery } from "@apollo/client/react";
import { ListingImageGallery } from './listing-image-gallery.tsx';
import { ViewListingImageGalleryGetImagesDocument,type ViewListingImageGalleryGetImagesQuery } from '../../../../../../../generated.tsx';


interface ListingImageGalleryContainerProps {
	listingId: string;
	className?: string;
}

export const ListingImageGalleryContainer: React.FC<ListingImageGalleryContainerProps> = ({
	listingId,
	className,
}) => {
	const { data, loading, error } = useQuery<ViewListingImageGalleryGetImagesQuery>(
		ViewListingImageGalleryGetImagesDocument,
		{
			variables: { listingId },
		},
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
};
