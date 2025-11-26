import type React from 'react';
import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client/react';
import { message } from 'antd';
import { EditListing, type EditListingFormData } from './edit-listing.tsx';
import {
	HomeAllListingsTableContainerMyListingsAllDocument,
	HomeEditListingContainerItemListingDocument,
	HomeEditListingContainerUpdateItemListingDocument,
	HomeEditListingContainerPauseItemListingDocument,
	HomeEditListingContainerDeleteItemListingDocument,
	HomeEditListingContainerCancelItemListingDocument,
	ListingsPageContainerGetListingsDocument,
	type HomeAllListingsTableContainerMyListingsAllQueryVariables,
	type HomeEditListingContainerItemListingQuery,
	type HomeEditListingContainerUpdateItemListingMutation,
	type HomeEditListingContainerUpdateItemListingMutationVariables,
	type HomeEditListingContainerPauseItemListingMutation,
	type HomeEditListingContainerPauseItemListingMutationVariables,
	type HomeEditListingContainerDeleteItemListingMutation,
	type HomeEditListingContainerDeleteItemListingMutationVariables,
	type HomeEditListingContainerCancelItemListingMutation,
	type HomeEditListingContainerCancelItemListingMutationVariables,
} from '../../../../../generated.tsx';
import { ComponentQueryLoader } from '@sthrift/ui-components';
import { useAuth } from 'react-oidc-context';

const myListingsTableDefaultVariables: HomeAllListingsTableContainerMyListingsAllQueryVariables =
	{
		page: 1,
		pageSize: 6,
		searchText: '',
		statusFilters: [],
	};

const toUtcMidnight = (value: string): Date => {
	const datePart = value?.split('T')[0];
	if (datePart) {
		const [yearPart, monthPart, dayPart] = datePart.split('-');
		const year = Number.parseInt(yearPart ?? '', 10);
		const month = Number.parseInt(monthPart ?? '', 10);
		const day = Number.parseInt(dayPart ?? '', 10);
		if (
			Number.isFinite(year) &&
			Number.isFinite(month) &&
			Number.isFinite(day)
		) {
			return new Date(Date.UTC(year, month - 1, day));
		}
	}
	const fallback = new Date(value);
	if (Number.isNaN(fallback.getTime())) {
		throw new Error('Invalid date string provided for reservation period');
	}
	return fallback;
};

const REFRESH_MY_LISTINGS_QUERIES = [
	{ query: ListingsPageContainerGetListingsDocument },
	{
		query: HomeAllListingsTableContainerMyListingsAllDocument,
		variables: myListingsTableDefaultVariables,
	},
];

/**
 * Container component for the Edit Listing page
 * Manages GraphQL queries, mutations, and business logic for editing listings
 */
interface EditListingContainerProps {
	isAuthenticated?: boolean;
}

export const EditListingContainer: React.FC<EditListingContainerProps> = (
	props,
) => {
	const navigate = useNavigate();
	const { listingId } = useParams<{ listingId: string }>();
	const auth = useAuth();
	const isUserAuthenticated = props.isAuthenticated ?? auth.isAuthenticated;
	const [uploadedImages, setUploadedImages] = useState<string[]>([]);

	// Static list of available categories for item listings
	const categories = useMemo(
		() => [
			'Electronics',
			'Clothing & Accessories',
			'Home & Garden',
			'Sports & Recreation',
			'Books & Media',
			'Tools & Equipment',
			'Vehicles',
			'Musical Instruments',
			'Art & Collectibles',
			'Other',
		],
		[],
	);

	// Fetch listing data
	const {
		data,
		loading: isLoadingListing,
		error,
	} = useQuery<HomeEditListingContainerItemListingQuery>(
		HomeEditListingContainerItemListingDocument,
		{
			variables: { id: listingId || '' },
			skip: !listingId,
			fetchPolicy: 'network-only',
		},
	);

	// Set initial images when data loads
	useEffect(() => {
		if (data?.itemListing?.images) {
			setUploadedImages(data.itemListing.images);
		}
	}, [data?.itemListing?.images]);

	// Update listing mutation
	const [updateItemListing, { loading: isUpdating }] = useMutation<
		HomeEditListingContainerUpdateItemListingMutation,
		HomeEditListingContainerUpdateItemListingMutationVariables
	>(HomeEditListingContainerUpdateItemListingDocument, {
		onCompleted: () => {
			message.success('Listing updated successfully!');
			navigate('/my-listings');
		},
		onError: (error) => {
			console.error('Error updating listing:', error);
			message.error('Failed to update listing. Please try again.');
		},
		refetchQueries: REFRESH_MY_LISTINGS_QUERIES,
		awaitRefetchQueries: true,
	});

	// Pause listing mutation
	const [pauseItemListing, { loading: isPausing }] = useMutation<
		HomeEditListingContainerPauseItemListingMutation,
		HomeEditListingContainerPauseItemListingMutationVariables
	>(HomeEditListingContainerPauseItemListingDocument, {
		onCompleted: () => {
			message.success('Listing paused successfully!');
			navigate('/my-listings');
		},
		onError: (error) => {
			console.error('Error pausing listing:', error);
			message.error('Failed to pause listing. Please try again.');
		},
		refetchQueries: REFRESH_MY_LISTINGS_QUERIES,
		awaitRefetchQueries: true,
	});

	// Delete listing mutation
	const [deleteItemListing, { loading: isDeleting }] = useMutation<
		HomeEditListingContainerDeleteItemListingMutation,
		HomeEditListingContainerDeleteItemListingMutationVariables
	>(HomeEditListingContainerDeleteItemListingDocument, {
		onCompleted: () => {
			message.success('Listing deleted successfully!');
			navigate('/my-listings');
		},
		onError: (error) => {
			console.error('Error deleting listing:', error);
			message.error('Failed to delete listing. Please try again.');
		},
		refetchQueries: REFRESH_MY_LISTINGS_QUERIES,
		awaitRefetchQueries: true,
	});

	// Cancel listing mutation
	const [cancelItemListing, { loading: isCancelling }] = useMutation<
		HomeEditListingContainerCancelItemListingMutation,
		HomeEditListingContainerCancelItemListingMutationVariables
	>(HomeEditListingContainerCancelItemListingDocument, {
		onCompleted: () => {
			message.success('Listing cancelled successfully!');
			navigate('/my-listings');
		},
		onError: (error) => {
			console.error('Error cancelling listing:', error);
			message.error('Failed to cancel listing. Please try again.');
		},
		refetchQueries: REFRESH_MY_LISTINGS_QUERIES,
		awaitRefetchQueries: true,
	});

	const handleSubmit = async (formData: EditListingFormData) => {
		if (!isUserAuthenticated) {
			sessionStorage.setItem('redirectTo', window.location.pathname);
			navigate('/auth-redirect');
			return;
		}

		if (!listingId) {
			message.error('Listing ID is missing');
			return;
		}

		const input = {
			title: formData.title,
			description: formData.description,
			category: formData.category,
			location: formData.location,
			sharingPeriodStart: toUtcMidnight(formData.sharingPeriod[0]),
			sharingPeriodEnd: toUtcMidnight(formData.sharingPeriod[1]),
			images: formData.images,
		};

		await updateItemListing({
			variables: { id: listingId, input },
		});
	};

	const handlePause = async () => {
		if (!listingId) return;

		await pauseItemListing({
			variables: { id: listingId },
		});
	};

	const handleDelete = async () => {
		if (!listingId) return;

		await deleteItemListing({
			variables: { id: listingId },
		});
	};

	const handleCancel = async () => {
		if (!listingId) return;

		await cancelItemListing({
			variables: { id: listingId },
		});
	};

	const handleNavigateBack = () => {
		navigate('/my-listings');
	};

	const handleImageRemove = (imageUrl: string) => {
		setUploadedImages((prev) => prev.filter((url) => url !== imageUrl));
	};

	const handleImageAdd = (imageUrl: string) => {
		setUploadedImages((prev) => [...prev, imageUrl]);
	};

	const isLoading =
		isLoadingListing || isUpdating || isPausing || isDeleting || isCancelling;

	// Early return if no listing data
	if (!data?.itemListing && !isLoadingListing && !error) {
		return <div>Listing not found</div>;
	}

	return (
		<ComponentQueryLoader
			loading={isLoadingListing}
			error={error}
			hasData={data?.itemListing}
			noDataComponent={<div>Listing not found</div>}
			hasDataComponent={
				data?.itemListing ? (
					<EditListing
						listing={data.itemListing}
						categories={categories}
						isLoading={isLoading}
						onSubmit={handleSubmit}
						onPause={handlePause}
						onDelete={handleDelete}
						onCancel={handleCancel}
						onNavigateBack={handleNavigateBack}
						uploadedImages={uploadedImages}
						onImageAdd={handleImageAdd}
						onImageRemove={handleImageRemove}
					/>
				) : (
					<div>Loading...</div>
				)
			}
		/>
	);
};
