import { gql } from '@apollo/client';
import { useQuery } from "@apollo/client/react";
import { ListingImageGallery } from './listing-image-gallery.tsx';
// eslint-disable-next-line import/no-absolute-path, @typescript-eslint/ban-ts-comment
// @ts-ignore - allow raw import string
import ListingImageGalleryQuerySource from './listing-image-gallery.graphql?raw';

const GET_LISTING_IMAGES = gql(ListingImageGalleryQuerySource);

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

export default function ListingImageGalleryContainer({
	listingId,
	className,
}: ListingImageGalleryContainerProps) {
	const { data, loading, error } = useQuery<ListingImagesResponse>(
		GET_LISTING_IMAGES,
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
}
