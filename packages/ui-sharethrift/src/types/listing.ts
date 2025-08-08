export interface ItemListing {
  _id: string;
  sharer: string; // User reference
  title: string;
  description: string;
  category: string;
  location: string;
  sharingPeriodStart: Date;
  sharingPeriodEnd: Date;
  state?: 'Published' | 'Paused' | 'Cancelled' | 'Drafted' | 'Expired' | 'Blocked' | 'Appeal Requested';
  updatedAt?: Date;
  createdAt?: Date;
  sharingHistory?: string[]; // objectid[]
  reports?: number;
  images?: string[]; // For UI purposes, we'll add image URLs
}

export interface ListingFilters {
  category?: string;
  searchQuery?: string;
}

export const LISTING_CATEGORIES = [
  'All',
  'Tools & Equipment',
  'Electronics', 
  'Sports & Outdoors',
  'Home & Garden',
  'Party & Events',
  'Vehicles & Transportation',
  'Kids & Baby',
  'Books & Media',
  'Clothing & Accessories',
  'Miscellaneous'
] as const;

export type ListingCategory = typeof LISTING_CATEGORIES[number];