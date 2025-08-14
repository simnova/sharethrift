import bikeImg from '../../../../assets/item-images/bike.png';
import airpodsImg from '../../../../assets/item-images/airpods.png';
import tentImg from '../../../../assets/item-images/tent.png';
import projectorImg from '../../../../assets/item-images/projector.png';
import sewingMachineImg from '../../../../assets/item-images/sewing-machine.png';
import fanImg from '../../../../assets/item-images/fan.png';
import hammockImg from '../../../../assets/item-images/hammock.png';
import umbrellaImg from '../../../../assets/item-images/umbrella.png';
import backpackImg from '../../../../assets/item-images/backpack.png';
import deskLampImg from '../../../../assets/item-images/desk-lamp.png';
import armchairImg from '../../../../assets/item-images/armchair.png';
import bubbleChairImg from '../../../../assets/item-images/bubble-chair.png';

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

export const DUMMY_LISTINGS: ItemListing[] = [
  { _id: '1', sharer: 'user1', title: 'City Bike', description: 'Perfect city bike for commuting and leisure rides around the neighborhood.', category: 'Vehicles & Transportation', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-11'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [bikeImg], createdAt: new Date('2024-08-01'), updatedAt: new Date('2024-08-01') },
  { _id: '2', sharer: 'user2', title: 'Cordless Drill', description: 'Professional grade cordless drill with multiple attachments. Perfect for home improvement projects.', category: 'Tools & Equipment', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-11'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [projectorImg], createdAt: new Date('2024-08-02'), updatedAt: new Date('2024-08-02') },
  { _id: '3', sharer: 'user3', title: 'Hand Mixer', description: 'Electric hand mixer with multiple speed settings. Great for baking and cooking.', category: 'Home & Garden', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-11'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [sewingMachineImg], createdAt: new Date('2024-08-03'), updatedAt: new Date('2024-08-03') },
  { _id: '4', sharer: 'user4', title: 'Golf Clubs', description: 'Complete set of golf clubs including driver, irons, and putter. Perfect for beginners.', category: 'Sports & Outdoors', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-11'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [backpackImg], createdAt: new Date('2024-08-04'), updatedAt: new Date('2024-08-04') },
  { _id: '5', sharer: 'user5', title: 'Beach Gear', description: 'Beach umbrella, chairs, and accessories for a perfect day at the beach.', category: 'Sports & Outdoors', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-11'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [umbrellaImg], createdAt: new Date('2024-08-05'), updatedAt: new Date('2024-08-05') },
  { _id: '6', sharer: 'user6', title: 'AirPods Pro', description: 'Noise-cancelling wireless earbuds with spatial audio. Perfect for music and calls.', category: 'Electronics', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-11'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [airpodsImg], createdAt: new Date('2024-08-06'), updatedAt: new Date('2024-08-06') },
  { _id: '7', sharer: 'user7', title: 'Camping Tent', description: '4-person camping tent with easy setup. Great for weekend camping trips.', category: 'Sports & Outdoors', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-11'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [tentImg], createdAt: new Date('2024-08-07'), updatedAt: new Date('2024-08-07') },
  { _id: '8', sharer: 'user8', title: 'Desk Lamp', description: 'Adjustable LED desk lamp with multiple brightness settings. Perfect for studying or working.', category: 'Home & Garden', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-11'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [deskLampImg], createdAt: new Date('2024-08-08'), updatedAt: new Date('2024-08-08') },
  { _id: '9', sharer: 'user9', title: 'Portable Fan', description: 'Quiet portable fan with multiple speed settings. Great for hot summer days.', category: 'Electronics', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-11'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [fanImg], createdAt: new Date('2024-08-09'), updatedAt: new Date('2024-08-09') },
  { _id: '10', sharer: 'user10', title: 'Garden Hammock', description: 'Comfortable hammock perfect for relaxing in the garden or backyard.', category: 'Home & Garden', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-11'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [hammockImg], createdAt: new Date('2024-08-10'), updatedAt: new Date('2024-08-10') },
  { _id: '11', sharer: 'user11', title: 'Comfortable Armchair', description: 'Ergonomic armchair perfect for reading or relaxing. Great condition.', category: 'Home & Garden', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-11'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [armchairImg], createdAt: new Date('2024-08-11'), updatedAt: new Date('2024-08-11') },
  { _id: '12', sharer: 'user12', title: 'Bubble Chair', description: 'Unique bubble-style hanging chair. Perfect statement piece for any room.', category: 'Home & Garden', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-11'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [bubbleChairImg], createdAt: new Date('2024-08-12'), updatedAt: new Date('2024-08-12') },
];
