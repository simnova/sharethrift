import { gql, useQuery } from '@apollo/client';
import type { ItemListing } from '../types/listing';

// GraphQL query for active listings
const GET_ACTIVE_LISTINGS = gql`
  query HomeListingsContainerActiveListings(
    $category: String
    $searchQuery: String
    $first: Int
    $after: String
  ) {
    activeListings(
      filter: {
        category: $category
        searchQuery: $searchQuery
        state: "Published"
      }
      first: $first
      after: $after
    ) {
      edges {
        node {
          _id
          title
          description
          category
          location
          sharingPeriodStart
          sharingPeriodEnd
          state
          images
          sharer {
            _id
            name
          }
          createdAt
          updatedAt
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

// GraphQL query for categories
const GET_CATEGORIES = gql`
  query GetCategories {
    categories
  }
`;

interface ActiveListingsVariables {
  category?: string;
  searchQuery?: string;
  first?: number;
  after?: string;
}

interface Sharer {
  _id: string;
  name: string;
}

interface ListingNode {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  sharingPeriodStart: string;
  sharingPeriodEnd: string;
  state: string;
  images: string[];
  sharer: Sharer;
  createdAt: string;
  updatedAt: string;
}

interface ListingEdge {
  node: ListingNode;
  cursor: string;
}

interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

interface ActiveListingsData {
  activeListings: {
    edges: ListingEdge[];
    pageInfo: PageInfo;
    totalCount: number;
  };
}

interface CategoriesData {
  categories: string[];
}

/**
 * Custom hook to fetch active listings from GraphQL backend
 */
export function useActiveListings(variables: ActiveListingsVariables) {
  const { data, loading, error, fetchMore, refetch } = useQuery<ActiveListingsData, ActiveListingsVariables>(
    GET_ACTIVE_LISTINGS,
    {
      variables,
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
    }
  );

  // Transform GraphQL data to match UI component expectations
  const transformedListings: ItemListing[] = data?.activeListings.edges.map(edge => ({
    _id: edge.node._id,
    sharer: edge.node.sharer._id,
    title: edge.node.title,
    description: edge.node.description,
    category: edge.node.category,
    location: edge.node.location,
    sharingPeriodStart: new Date(edge.node.sharingPeriodStart),
    sharingPeriodEnd: new Date(edge.node.sharingPeriodEnd),
    state: edge.node.state as ItemListing['state'],
    images: edge.node.images,
    createdAt: new Date(edge.node.createdAt),
    updatedAt: new Date(edge.node.updatedAt),
  })) || [];

  const loadMoreListings = () => {
    if (data?.activeListings.pageInfo.hasNextPage) {
      return fetchMore({
        variables: {
          ...variables,
          after: data.activeListings.pageInfo.endCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return prev;
          }
          
          return {
            activeListings: {
              ...fetchMoreResult.activeListings,
              edges: [
                ...prev.activeListings.edges,
                ...fetchMoreResult.activeListings.edges,
              ],
            },
          };
        },
      });
    }
  };

  return {
    listings: transformedListings,
    loading,
    error,
    totalCount: data?.activeListings.totalCount || 0,
    hasNextPage: data?.activeListings.pageInfo.hasNextPage || false,
    loadMore: loadMoreListings,
    refetch,
  };
}

/**
 * Custom hook to fetch available categories from GraphQL backend
 */
export function useCategories() {
  const { data, loading, error } = useQuery<CategoriesData>(GET_CATEGORIES, {
    errorPolicy: 'all',
  });

  return {
    categories: data?.categories || [],
    loading,
    error,
  };
}
