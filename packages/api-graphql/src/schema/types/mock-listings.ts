
export interface ItemListing {
  _id: string;
  sharer: string;
  title: string;
  description: string;
  category: string;
  location: string;
  sharingPeriodStart: Date;
  sharingPeriodEnd: Date;
  state?: 'Published' | 'Paused' | 'Cancelled' | 'Drafted' | 'Expired' | 'Blocked' | 'Appeal Requested';
  updatedAt?: Date;
  createdAt?: Date;
  sharingHistory?: string[];
  reports?: number;
  images?: string[];
}

export const DUMMY_LISTINGS: ItemListing[] = [
  { _id: '1', sharer: 'Patrick G.', title: 'City Bike', description: 'Perfect city bike for commuting and leisure rides around the neighborhood.', category: 'Vehicles & Transportation', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-11'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: ['https://example.com/bike.png','https://example.com/bike.png','https://example.com/bike.png'], createdAt: new Date('2024-08-01'), updatedAt: new Date('2024-08-01') },
  { _id: '2', sharer: 'Samantha R.', title: 'Cordless Drill', description: 'Professional grade cordless drill with multiple attachments. Perfect for home improvement projects.', category: 'Tools & Equipment', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-11'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: ['https://example.com/projector.png','https://example.com/projector.png','https://example.com/projector.png'], createdAt: new Date('2024-08-02'), updatedAt: new Date('2024-08-02') },
  { _id: '3', sharer: 'Michael T.', title: 'Hand Mixer', description: 'Electric hand mixer with multiple speed settings. Great for baking and cooking.', category: 'Home & Garden', location: 'Philadelphia, PA', sharingPeriodStart: new Date('2024-08-11'), sharingPeriodEnd: new Date('2024-12-23'), state: 'Published', images: ['https://example.com/sewing-machine.png','https://example.com/sewing-machine.png','https://example.com/sewing-machine.png'], createdAt: new Date('2024-08-03'), updatedAt: new Date('2024-08-03') },
  // ...existing code...
];
