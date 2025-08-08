// Mock data for listings since database is not set up yet
export interface MockListing {
  _id: string;
  sharer: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  title: string;
  description: string;
  category: string;
  location: string;
  sharingPeriodStart: string;
  sharingPeriodEnd: string;
  state: 'Published' | 'Paused' | 'Cancelled' | 'Drafted' | 'Expired' | 'Blocked' | 'Appeal Requested';
  updatedAt: string;
  createdAt: string;
  sharingHistory: string[];
  reports: number;
  image: string; // Path to image in assets
}

export const CATEGORIES = [
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
];

export const mockListings: MockListing[] = [
  {
    _id: '1',
    sharer: { _id: 'user1', firstName: 'John', lastName: 'Doe' },
    title: 'City Bike',
    description: 'Perfect city bike for commuting around town. Well maintained and ready to ride.',
    category: 'Vehicles & Transportation',
    location: 'Philadelphia, PA',
    sharingPeriodStart: '2025-01-15T00:00:00Z',
    sharingPeriodEnd: '2025-02-28T23:59:59Z',
    state: 'Published',
    updatedAt: '2025-01-10T10:00:00Z',
    createdAt: '2025-01-08T15:30:00Z',
    sharingHistory: [],
    reports: 0,
    image: '/src/assets/item-images/bike.png'
  },
  {
    _id: '2', 
    sharer: { _id: 'user2', firstName: 'Sarah', lastName: 'Johnson' },
    title: 'Wireless Earbuds',
    description: 'High-quality wireless earbuds with noise cancellation. Great for workouts or travel.',
    category: 'Electronics',
    location: 'Philadelphia, PA',
    sharingPeriodStart: '2025-01-12T00:00:00Z',
    sharingPeriodEnd: '2025-01-25T23:59:59Z',
    state: 'Published',
    updatedAt: '2025-01-09T14:20:00Z',
    createdAt: '2025-01-07T09:15:00Z',
    sharingHistory: [],
    reports: 0,
    image: '/src/assets/item-images/airpods.png'
  },
  {
    _id: '3',
    sharer: { _id: 'user3', firstName: 'Mike', lastName: 'Chen' },
    title: 'Camping Tent',
    description: '4-person camping tent, waterproof and easy to set up. Perfect for weekend trips.',
    category: 'Sports & Outdoors',
    location: 'Philadelphia, PA', 
    sharingPeriodStart: '2025-01-20T00:00:00Z',
    sharingPeriodEnd: '2025-03-15T23:59:59Z',
    state: 'Published',
    updatedAt: '2025-01-10T16:45:00Z',
    createdAt: '2025-01-06T11:22:00Z',
    sharingHistory: [],
    reports: 0,
    image: '/src/assets/item-images/tent.png'
  },
  {
    _id: '4',
    sharer: { _id: 'user4', firstName: 'Emily', lastName: 'Rodriguez' },
    title: 'Kitchen Utensils Set',
    description: 'Complete set of kitchen utensils including spatulas, ladles, and tongs.',
    category: 'Home & Garden',
    location: 'Philadelphia, PA',
    sharingPeriodStart: '2025-01-18T00:00:00Z',
    sharingPeriodEnd: '2025-02-18T23:59:59Z',
    state: 'Published',
    updatedAt: '2025-01-11T08:30:00Z',
    createdAt: '2025-01-05T13:45:00Z',
    sharingHistory: [],
    reports: 0,
    image: '/src/assets/item-images/utensils.png'
  },
  {
    _id: '5',
    sharer: { _id: 'user5', firstName: 'David', lastName: 'Wilson' },
    title: 'Projector',
    description: 'HD projector perfect for movie nights or presentations. Includes all cables.',
    category: 'Electronics',
    location: 'Philadelphia, PA',
    sharingPeriodStart: '2025-01-22T00:00:00Z',
    sharingPeriodEnd: '2025-02-22T23:59:59Z',
    state: 'Published',
    updatedAt: '2025-01-10T12:15:00Z',
    createdAt: '2025-01-04T16:20:00Z',
    sharingHistory: [],
    reports: 0,
    image: '/src/assets/item-images/projector.png'
  },
  {
    _id: '6',
    sharer: { _id: 'user6', firstName: 'Lisa', lastName: 'Thompson' },
    title: 'Comfortable Armchair',
    description: 'Cozy reading chair in excellent condition. Perfect for any living space.',
    category: 'Home & Garden',
    location: 'Philadelphia, PA',
    sharingPeriodStart: '2025-01-14T00:00:00Z',
    sharingPeriodEnd: '2025-03-14T23:59:59Z',
    state: 'Published',
    updatedAt: '2025-01-09T10:45:00Z',
    createdAt: '2025-01-03T14:30:00Z',
    sharingHistory: [],
    reports: 0,
    image: '/src/assets/item-images/armchair.png'
  },
  {
    _id: '7',
    sharer: { _id: 'user7', firstName: 'Alex', lastName: 'Garcia' },
    title: 'Travel Backpack',
    description: 'Spacious travel backpack with multiple compartments. Great for hiking or travel.',
    category: 'Miscellaneous',
    location: 'Philadelphia, PA',
    sharingPeriodStart: '2025-01-16T00:00:00Z',
    sharingPeriodEnd: '2025-02-16T23:59:59Z',
    state: 'Published',
    updatedAt: '2025-01-08T15:20:00Z',
    createdAt: '2025-01-02T09:10:00Z',
    sharingHistory: [],
    reports: 0,
    image: '/src/assets/item-images/backpack.png'
  },
  {
    _id: '8',
    sharer: { _id: 'user8', firstName: 'Jessica', lastName: 'Lee' },
    title: 'String Lights',
    description: 'Beautiful LED string lights perfect for parties or decorating any space.',
    category: 'Party & Events',
    location: 'Philadelphia, PA',
    sharingPeriodStart: '2025-01-19T00:00:00Z',
    sharingPeriodEnd: '2025-02-19T23:59:59Z',
    state: 'Published',
    updatedAt: '2025-01-11T11:30:00Z',
    createdAt: '2025-01-01T12:45:00Z',
    sharingHistory: [],
    reports: 0,
    image: '/src/assets/item-images/string-lights.png'
  }
];