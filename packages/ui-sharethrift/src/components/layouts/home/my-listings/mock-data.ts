import bikeImg from '@sthrift/ui-sharethrift-components/src/assets/item-images/bike.png';
import tentImg from '@sthrift/ui-sharethrift-components/src/assets/item-images/tent.png';
import projectorImg from '@sthrift/ui-sharethrift-components/src/assets/item-images/projector.png';
import sewingMachineImg from '@sthrift/ui-sharethrift-components/src/assets/item-images/sewing-machine.png';
import bubbleChairImg from '@sthrift/ui-sharethrift-components/src/assets/item-images/bubble-chair.png';
import armchairImg from '@sthrift/ui-sharethrift-components/src/assets/item-images/armchair.png';

// Extended listing interface for My Listings dashboard
export interface MyListing {
  _id: string;
  sharer: string;
  title: string;
  description: string;
  category: string;
  location: string;
  sharingPeriodStart: Date;
  sharingPeriodEnd: Date;
  publishedAt: Date;
  status: 'Active' | 'Paused' | 'Reserved' | 'Expired' | 'Draft' | 'Blocked';
  pendingRequests: number;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Request interface for the Requests tab
export interface ListingRequest {
  _id: string;
  listingId: string;
  listing: {
    _id: string;
    title: string;
    images: string[];
  };
  requestedBy: string; // username
  requestedByUserId: string;
  requestedOn: Date;
  reservationPeriodStart: Date;
  reservationPeriodEnd: Date;
  status: 'Accepted' | 'Rejected' | 'Closed' | 'Pending' | 'Closing' | 'Cancelled';
  createdAt: Date;
  updatedAt: Date;
}

// Mock data for current user's listings
export const MOCK_MY_LISTINGS: MyListing[] = [
  {
    _id: '1',
    sharer: 'currentUser',
    title: 'Cordless Drill',
    description: 'Professional grade cordless drill with multiple attachments.',
    category: 'Tools & Equipment',
    location: 'Philadelphia, PA',
    sharingPeriodStart: new Date('2020-11-08'),
    sharingPeriodEnd: new Date('2020-12-23'),
    publishedAt: new Date('2025-12-23'),
    status: 'Paused',
    pendingRequests: 0,
    images: [projectorImg],
    createdAt: new Date('2025-12-20'),
    updatedAt: new Date('2025-12-22'),
  },
  {
    _id: '2',
    sharer: 'currentUser',
    title: 'City Bike',
    description: 'Perfect city bike for commuting and leisure rides.',
    category: 'Vehicles & Transportation',
    location: 'Philadelphia, PA',
    sharingPeriodStart: new Date('2020-11-08'),
    sharingPeriodEnd: new Date('2020-12-23'),
    publishedAt: new Date('2025-01-03'),
    status: 'Active',
    pendingRequests: 2,
    images: [bikeImg],
    createdAt: new Date('2024-12-20'),
    updatedAt: new Date('2025-01-02'),
  },
  {
    _id: '3',
    sharer: 'currentUser',
    title: 'Sewing Kit',
    description: 'Complete sewing kit with threads, needles, and accessories.',
    category: 'Home & Garden',
    location: 'Philadelphia, PA',
    sharingPeriodStart: new Date('2020-11-08'),
    sharingPeriodEnd: new Date('2020-12-23'),
    publishedAt: new Date('2025-01-12'),
    status: 'Expired',
    pendingRequests: 0,
    images: [sewingMachineImg],
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-12'),
  },
  {
    _id: '4',
    sharer: 'currentUser',
    title: 'Monopoly Board Game',
    description: 'Classic board game for family game nights.',
    category: 'Books & Media',
    location: 'Philadelphia, PA',
    sharingPeriodStart: new Date('2020-11-08'),
    sharingPeriodEnd: new Date('2020-12-23'),
    publishedAt: new Date('2024-04-02'),
    status: 'Blocked',
    pendingRequests: 0,
    images: [bubbleChairImg],
    createdAt: new Date('2024-03-30'),
    updatedAt: new Date('2024-04-01'),
  },
  {
    _id: '5',
    sharer: 'currentUser',
    title: 'Camping Tent',
    description: '4-person camping tent with easy setup.',
    category: 'Sports & Outdoors',
    location: 'Philadelphia, PA',
    sharingPeriodStart: new Date('2020-11-08'),
    sharingPeriodEnd: new Date('2020-12-23'),
    publishedAt: new Date('2024-02-22'),
    status: 'Reserved',
    pendingRequests: 1,
    images: [tentImg],
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-22'),
  },
  {
    _id: '6',
    sharer: 'currentUser',
    title: 'Outdoor Table And Chairs',
    description: 'Perfect for outdoor dining and gatherings.',
    category: 'Home & Garden',
    location: 'Philadelphia, PA',
    sharingPeriodStart: new Date('2020-11-08'),
    sharingPeriodEnd: new Date('2020-12-23'),
    publishedAt: new Date('2022-05-17'),
    status: 'Draft',
    pendingRequests: 0,
    images: [armchairImg],
    createdAt: new Date('2022-05-15'),
    updatedAt: new Date('2022-05-17'),
  },
];

// Mock data for listing requests
export const MOCK_LISTING_REQUESTS: ListingRequest[] = [
  {
    _id: '1',
    listingId: '2',
    listing: {
      _id: '2',
      title: 'City Bike',
      images: [bikeImg],
    },
    requestedBy: '@patrickg',
    requestedByUserId: 'patrick123',
    requestedOn: new Date('2025-12-23'),
    reservationPeriodStart: new Date('2020-11-08'),
    reservationPeriodEnd: new Date('2020-12-23'),
    status: 'Pending',
    createdAt: new Date('2025-12-20'),
    updatedAt: new Date('2025-12-22'),
  },
  {
    _id: '2',
    listingId: '5',
    listing: {
      _id: '5',
      title: 'Camping Tent',
      images: [tentImg],
    },
    requestedBy: '@jasonm',
    requestedByUserId: 'jason456',
    requestedOn: new Date('2025-01-03'),
    reservationPeriodStart: new Date('2020-11-08'),
    reservationPeriodEnd: new Date('2020-12-23'),
    status: 'Accepted',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-02'),
  },
  {
    _id: '3',
    listingId: '5',
    listing: {
      _id: '5',
      title: 'Camping Tent',
      images: [tentImg],
    },
    requestedBy: '@shannonj',
    requestedByUserId: 'shannon789',
    requestedOn: new Date('2025-01-12'),
    reservationPeriodStart: new Date('2020-11-08'),
    reservationPeriodEnd: new Date('2020-12-23'),
    status: 'Rejected',
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-12'),
  },
  {
    _id: '4',
    listingId: '5',
    listing: {
      _id: '5',
      title: 'Camping Tent',
      images: [tentImg],
    },
    requestedBy: '@patrickg',
    requestedByUserId: 'patrick123',
    requestedOn: new Date('2024-04-02'),
    reservationPeriodStart: new Date('2020-11-08'),
    reservationPeriodEnd: new Date('2020-12-23'),
    status: 'Closed',
    createdAt: new Date('2024-03-30'),
    updatedAt: new Date('2024-04-01'),
  },
  {
    _id: '5',
    listingId: '2',
    listing: {
      _id: '2',
      title: 'City Bike',
      images: [bikeImg],
    },
    requestedBy: '@jasonm',
    requestedByUserId: 'jason456',
    requestedOn: new Date('2024-02-22'),
    reservationPeriodStart: new Date('2020-11-08'),
    reservationPeriodEnd: new Date('2020-12-23'),
    status: 'Cancelled',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-22'),
  },
  {
    _id: '6',
    listingId: '2',
    listing: {
      _id: '2',
      title: 'City Bike',
      images: [bikeImg],
    },
    requestedBy: '@kisharg',
    requestedByUserId: 'kishar999',
    requestedOn: new Date('2022-05-17'),
    reservationPeriodStart: new Date('2020-11-08'),
    reservationPeriodEnd: new Date('2020-12-23'),
    status: 'Cancelled',
    createdAt: new Date('2022-05-15'),
    updatedAt: new Date('2022-05-17'),
  },
];

// Status color mapping
export const STATUS_COLORS = {
  Active: 'green',
  Paused: 'orange', // yellow shows poorly, using orange instead
  Reserved: 'blue',
  Draft: 'default',
  Cancelled: 'default',
  Closed: 'default',
  Blocked: 'purple',
  Expired: 'red',
  // Request statuses
  Accepted: 'green',
  Rejected: 'red',
  Pending: 'orange',
  Closing: 'orange',
} as const;

export type StatusColor = typeof STATUS_COLORS[keyof typeof STATUS_COLORS];