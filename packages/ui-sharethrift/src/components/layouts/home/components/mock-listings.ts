import bikeImg from '@sthrift/ui-sharethrift-components/src/assets/item-images/bike.png';
import airpodsImg from '@sthrift/ui-sharethrift-components/src/assets/item-images/airpods.png';
import tentImg from '@sthrift/ui-sharethrift-components/src/assets/item-images/tent.png';
import projectorImg from '@sthrift/ui-sharethrift-components/src/assets/item-images/projector.png';
import sewingMachineImg from '@sthrift/ui-sharethrift-components/src/assets/item-images/sewing-machine.png';
import fanImg from '@sthrift/ui-sharethrift-components/src/assets/item-images/fan.png';
import hammockImg from '@sthrift/ui-sharethrift-components/src/assets/item-images/hammock.png';
import umbrellaImg from '@sthrift/ui-sharethrift-components/src/assets/item-images/umbrella.png';
import backpackImg from '@sthrift/ui-sharethrift-components/src/assets/item-images/backpack.png';
import deskLampImg from '@sthrift/ui-sharethrift-components/src/assets/item-images/desk-lamp.png';
import armchairImg from '@sthrift/ui-sharethrift-components/src/assets/item-images/armchair.png';
import bubbleChairImg from '@sthrift/ui-sharethrift-components/src/assets/item-images/bubble-chair.png';

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
  { _id: '1', sharer: 'Patrick G.', title: 'City Bike', description: 'Perfect city bike for commuting and leisure rides around the neighborhood.', category: 'Vehicles & Transportation', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-11'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [bikeImg, bikeImg, bikeImg], createdAt: new Date('2024-08-01'), updatedAt: new Date('2024-08-01') },
  { _id: '2', sharer: 'Samantha R.', title: 'Cordless Drill', description: 'Professional grade cordless drill with multiple attachments. Perfect for home improvement projects.', category: 'Tools & Equipment', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-11'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [projectorImg, projectorImg, projectorImg], createdAt: new Date('2024-08-02'), updatedAt: new Date('2024-08-02') },
  { _id: '3', sharer: 'Michael T.', title: 'Hand Mixer', description: 'Electric hand mixer with multiple speed settings. Great for baking and cooking.', category: 'Home & Garden', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-11'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [sewingMachineImg, sewingMachineImg, sewingMachineImg], createdAt: new Date('2024-08-03'), updatedAt: new Date('2024-08-03') },
  { _id: '4', sharer: 'Linda S.', title: 'Golf Clubs', description: 'Complete set of golf clubs including driver, irons, and putter. Perfect for beginners.', category: 'Sports & Outdoors', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-11'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [backpackImg, backpackImg, backpackImg], createdAt: new Date('2024-08-04'), updatedAt: new Date('2024-08-04') },
  { _id: '5', sharer: 'Carlos M.', title: 'Beach Gear', description: 'Beach umbrella, chairs, and accessories for a perfect day at the beach.', category: 'Sports & Outdoors', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-11'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [umbrellaImg, umbrellaImg, umbrellaImg], createdAt: new Date('2024-08-05'), updatedAt: new Date('2024-08-05') },
  { _id: '6', sharer: 'Emily W.', title: 'AirPods Pro', description: 'Noise-cancelling wireless earbuds with spatial audio. Perfect for music and calls.', category: 'Electronics', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-11'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [airpodsImg, airpodsImg, airpodsImg], createdAt: new Date('2024-08-06'), updatedAt: new Date('2024-08-06') },
  { _id: '7', sharer: 'David B.', title: 'Camping Tent', description: '4-person camping tent with easy setup. Great for weekend camping trips.', category: 'Sports & Outdoors', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-11'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [tentImg, tentImg, tentImg], createdAt: new Date('2024-08-07'), updatedAt: new Date('2024-08-07') },
  { _id: '8', sharer: 'Olivia K.', title: 'Desk Lamp', description: 'Adjustable LED desk lamp with multiple brightness settings. Perfect for studying or working.', category: 'Home & Garden', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-11'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [deskLampImg, deskLampImg, deskLampImg], createdAt: new Date('2024-08-08'), updatedAt: new Date('2024-08-08') },
  { _id: '9', sharer: 'James F.', title: 'Portable Fan', description: 'Quiet portable fan with multiple speed settings. Great for hot summer days.', category: 'Electronics', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-11'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [fanImg, fanImg, fanImg], createdAt: new Date('2024-08-09'), updatedAt: new Date('2024-08-09') },
  { _id: '10', sharer: 'Sophia L.', title: 'Garden Hammock', description: 'Comfortable hammock perfect for relaxing in the garden or backyard.', category: 'Home & Garden', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-11'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [hammockImg, hammockImg, hammockImg], createdAt: new Date('2024-08-10'), updatedAt: new Date('2024-08-10') },
  { _id: '11', sharer: 'Henry C.', title: 'Comfortable Armchair', description: 'Ergonomic armchair perfect for reading or relaxing. Great condition.', category: 'Home & Garden', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-11'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [armchairImg, armchairImg, armchairImg], createdAt: new Date('2024-08-11'), updatedAt: new Date('2024-08-11') },
  { _id: '12', sharer: 'Grace P.', title: 'Bubble Chair', description: 'Unique bubble-style hanging chair. Perfect statement piece for any room.', category: 'Home & Garden', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-11'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [bubbleChairImg, bubbleChairImg, bubbleChairImg], createdAt: new Date('2024-08-12'), updatedAt: new Date('2024-08-12') },
  { _id: '13', sharer: 'user13', title: 'Projector', description: 'HD projector for movie nights and presentations.', category: 'Electronics', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-13'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [projectorImg], createdAt: new Date('2024-08-13'), updatedAt: new Date('2024-08-13') },
  { _id: '14', sharer: 'user14', title: 'Sewing Machine', description: 'Easy-to-use sewing machine for beginners and pros.', category: 'Home & Garden', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-14'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [sewingMachineImg], createdAt: new Date('2024-08-14'), updatedAt: new Date('2024-08-14') },
  { _id: '15', sharer: 'user15', title: 'Kids Backpack', description: 'Colorful backpack for school or travel.', category: 'Kids & Baby', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-15'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [backpackImg], createdAt: new Date('2024-08-15'), updatedAt: new Date('2024-08-15') },
  { _id: '16', sharer: 'user16', title: 'Umbrella', description: 'Large umbrella for rainy days or sunny outings.', category: 'Miscellaneous', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-16'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [umbrellaImg], createdAt: new Date('2024-08-16'), updatedAt: new Date('2024-08-16') },
  { _id: '17', sharer: 'user17', title: 'Reading Lamp', description: 'LED reading lamp with adjustable brightness.', category: 'Home & Garden', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-17'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [deskLampImg], createdAt: new Date('2024-08-17'), updatedAt: new Date('2024-08-17') },
  { _id: '18', sharer: 'user18', title: 'Bluetooth Speaker', description: 'Portable Bluetooth speaker with great sound.', category: 'Electronics', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-18'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [fanImg], createdAt: new Date('2024-08-18'), updatedAt: new Date('2024-08-18') },
  { _id: '19', sharer: 'user19', title: 'Garden Tools Set', description: 'Complete set of tools for gardening.', category: 'Home & Garden', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-19'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [armchairImg], createdAt: new Date('2024-08-19'), updatedAt: new Date('2024-08-19') },
  { _id: '20', sharer: 'user20', title: 'Hammock Stand', description: 'Sturdy stand for your garden hammock.', category: 'Home & Garden', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-20'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [hammockImg], createdAt: new Date('2024-08-20'), updatedAt: new Date('2024-08-20') },
  { _id: '21', sharer: 'user21', title: 'Camping Tent', description: '4-person camping tent with easy setup. Great for weekend camping trips.', category: 'Sports & Outdoors', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-11'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [tentImg], createdAt: new Date('2024-08-07'), updatedAt: new Date('2024-08-07') },
  { _id: '22', sharer: 'user22', title: 'Desk Lamp', description: 'Adjustable LED desk lamp with multiple brightness settings. Perfect for studying or working.', category: 'Home & Garden', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-11'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [deskLampImg], createdAt: new Date('2024-08-08'), updatedAt: new Date('2024-08-08') },
  { _id: '23', sharer: 'user23', title: 'Portable Fan', description: 'Quiet portable fan with multiple speed settings. Great for hot summer days.', category: 'Electronics', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-11'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [fanImg], createdAt: new Date('2024-08-09'), updatedAt: new Date('2024-08-09') },
  { _id: '24', sharer: 'user24', title: 'Garden Hammock', description: 'Comfortable hammock perfect for relaxing in the garden or backyard.', category: 'Home & Garden', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-11'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [hammockImg], createdAt: new Date('2024-08-10'), updatedAt: new Date('2024-08-10') },
  { _id: '25', sharer: 'user25', title: 'Comfortable Armchair', description: 'Ergonomic armchair perfect for reading or relaxing. Great condition.', category: 'Home & Garden', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-11'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [armchairImg], createdAt: new Date('2024-08-11'), updatedAt: new Date('2024-08-11') },
  { _id: '26', sharer: 'user26', title: 'Bubble Chair', description: 'Unique bubble-style hanging chair. Perfect statement piece for any room.', category: 'Home & Garden', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-11'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [bubbleChairImg], createdAt: new Date('2024-08-12'), updatedAt: new Date('2024-08-12') },
  { _id: '13', sharer: 'user13', title: 'Projector', description: 'HD projector for movie nights and presentations.', category: 'Electronics', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-13'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [projectorImg], createdAt: new Date('2024-08-13'), updatedAt: new Date('2024-08-13') },
  { _id: '14', sharer: 'user14', title: 'Sewing Machine', description: 'Easy-to-use sewing machine for beginners and pros.', category: 'Home & Garden', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-14'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [sewingMachineImg], createdAt: new Date('2024-08-14'), updatedAt: new Date('2024-08-14') },
  { _id: '15', sharer: 'user15', title: 'Kids Backpack', description: 'Colorful backpack for school or travel.', category: 'Kids & Baby', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-15'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [backpackImg], createdAt: new Date('2024-08-15'), updatedAt: new Date('2024-08-15') },
  { _id: '16', sharer: 'user16', title: 'Umbrella', description: 'Large umbrella for rainy days or sunny outings.', category: 'Miscellaneous', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-16'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [umbrellaImg], createdAt: new Date('2024-08-16'), updatedAt: new Date('2024-08-16') },
  { _id: '17', sharer: 'user17', title: 'Reading Lamp', description: 'LED reading lamp with adjustable brightness.', category: 'Home & Garden', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-17'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [deskLampImg], createdAt: new Date('2024-08-17'), updatedAt: new Date('2024-08-17') },
  { _id: '18', sharer: 'user18', title: 'Bluetooth Speaker', description: 'Portable Bluetooth speaker with great sound.', category: 'Electronics', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-18'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [fanImg], createdAt: new Date('2024-08-18'), updatedAt: new Date('2024-08-18') },
  { _id: '19', sharer: 'user19', title: 'Garden Tools Set', description: 'Complete set of tools for gardening.', category: 'Home & Garden', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-19'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [armchairImg], createdAt: new Date('2024-08-19'), updatedAt: new Date('2024-08-19') },
  { _id: '20', sharer: 'user20', title: 'Hammock Stand', description: 'Sturdy stand for your garden hammock.', category: 'Home & Garden', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-20'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: [hammockImg], createdAt: new Date('2024-08-20'), updatedAt: new Date('2024-08-20') },
];