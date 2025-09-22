import type React from 'react';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import { message } from 'antd';
// eslint-disable-next-line import/no-absolute-path, @typescript-eslint/ban-ts-comment
// @ts-ignore - allow raw import string
import CreateListingMutationSource from './create-listing.container.graphql?raw';
import { CreateListing, type CreateListingFormData } from './create-listing';

// Parse the GraphQL operations
const CREATE_LISTING_MUTATION = gql(CreateListingMutationSource);

interface CreateListingContainerProps {
	isAuthenticated?: boolean;
}

export const CreateListingContainer: React.FC<CreateListingContainerProps> = (
	props,
) => {
	const navigate = useNavigate();
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

	// Create listing mutation
	const [createItemListing, { loading: isCreating }] = useMutation(
		CREATE_LISTING_MUTATION,
		{
			onCompleted: (data) => {
				const isDraft = data.createItemListing.state === 'Drafted';
				message.success(
					isDraft
						? 'Listing saved as draft!'
						: 'Listing published successfully!',
				);

				// Don't navigate automatically - let user choose from modal
			},
			onError: (error) => {
				console.error('Error creating listing:', error);
				message.error('Failed to create listing. Please try again.');
			},
			// Refetch listings to update the cache
			refetchQueries: ['GetListings'],
		},
	);

	const handleSubmit = async (
		formData: CreateListingFormData,
		isDraft: boolean,
	) => {
		if (!props.isAuthenticated) {
			// Store the intended destination for after login
			sessionStorage.setItem('redirectTo', '/create-listing');
			navigate('/auth-redirect');
			return;
		}

		const input = {
			title: formData.title,
			description: formData.description,
			category: formData.category,
			location: formData.location,
			sharingPeriodStart: new Date(formData.sharingPeriod[0]),
			sharingPeriodEnd: new Date(formData.sharingPeriod[1]),
			images: formData.images,
			isDraft,
		};

		await createItemListing({
			variables: { input },
		});
	};

	const handleCancel = () => {
		navigate(-1); // Go back to previous page
	};

	const handleViewListing = () => {
		navigate('/my-listings');
	};

	const handleViewDraft = () => {
		navigate('/my-listings');
	};

	const handleModalClose = () => {
		// Just close the modal without navigation
	};

	const handleImageRemove = (imageUrl: string) => {
		setUploadedImages((prev) => prev.filter((url) => url !== imageUrl));
	};

	const handleImageAdd = (imageUrl: string) => {
		setUploadedImages((prev) => [...prev, imageUrl]);
	};

	return (
		<CreateListing
			categories={categories}
			isLoading={isCreating}
			onSubmit={handleSubmit}
			onCancel={handleCancel}
			uploadedImages={uploadedImages}
			onImageAdd={handleImageAdd}
			onImageRemove={handleImageRemove}
			onViewListing={handleViewListing}
			onViewDraft={handleViewDraft}
			onModalClose={handleModalClose}
		/>
	);
};
