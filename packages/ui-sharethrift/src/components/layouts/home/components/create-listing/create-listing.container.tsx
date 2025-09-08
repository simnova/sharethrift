import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { gql, useQuery, useMutation } from '@apollo/client';
import { message } from 'antd';
// eslint-disable-next-line import/no-absolute-path, @typescript-eslint/ban-ts-comment
// @ts-ignore - allow raw import string
import CreateListingMutationSource from './create-listing.container.graphql?raw';
// eslint-disable-next-line import/no-absolute-path, @typescript-eslint/ban-ts-comment
// @ts-ignore - allow raw import string
import ListingsQuerySource from '../listings-page.container.graphql?raw';
import { CreateListing, type CreateListingFormData } from './create-listing';

// Parse the GraphQL operations
const CREATE_LISTING_MUTATION = gql(CreateListingMutationSource);
const LISTINGS_QUERY = gql(ListingsQuerySource);

interface CreateListingContainerProps {
  readonly isAuthenticated?: boolean;
}

interface CreateItemListingInput {
  title: string;
  description: string;
  category: string;
  location: string;
  sharingPeriodStart: string;
  sharingPeriodEnd: string;
  images?: string[];
  isDraft?: boolean;
}

interface CategoriesQueryData {
  itemListings: Array<{ category: string }>;
}

export function CreateListingContainer({ isAuthenticated }: CreateListingContainerProps) {
  const navigate = useNavigate();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  // Get categories from existing listings
  const { data: categoriesData } = useQuery<CategoriesQueryData>(LISTINGS_QUERY, {
    fetchPolicy: 'cache-first',
  });

  // Extract unique categories
  const categories = useMemo(() => {
    if (!categoriesData?.itemListings) return [];
    const uniqueCategories = [...new Set(categoriesData.itemListings.map(l => l.category))];
    return uniqueCategories.sort();
  }, [categoriesData]);

  // Create listing mutation
  const [createItemListing, { loading: isCreating }] = useMutation(CREATE_LISTING_MUTATION, {
    onCompleted: (data) => {
      const isDraft = data.createItemListing.state === 'Drafted';
      message.success(isDraft ? 'Listing saved as draft!' : 'Listing published successfully!');
      
      // Navigate to the new listing or my listings
      if (isDraft) {
        navigate('/my-listings');
      } else {
        navigate(`/listing/${data.createItemListing.id}`);
      }
    },
    onError: (error) => {
      console.error('Error creating listing:', error);
      message.error('Failed to create listing. Please try again.');
    },
    // Refetch listings to update the cache
    refetchQueries: ['GetListings'],
  });

  const handleSubmit = async (formData: CreateListingFormData, isDraft: boolean) => {
    if (!isAuthenticated) {
      message.error('You must be logged in to create a listing');
      return;
    }

    const input: CreateItemListingInput = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      location: formData.location,
      sharingPeriodStart: formData.sharingPeriod[0],
      sharingPeriodEnd: formData.sharingPeriod[1],
      images: formData.images,
      isDraft,
    };

    try {
      await createItemListing({
        variables: { input },
      });
    } catch (error) {
      // Error handling is done in onError callback
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  const handleImageRemove = (imageUrl: string) => {
    setUploadedImages(prev => prev.filter(url => url !== imageUrl));
  };

  const handleImageAdd = (imageUrl: string) => {
    setUploadedImages(prev => [...prev, imageUrl]);
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
    />
  );
}