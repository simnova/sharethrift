import type { Meta, StoryObj } from '@storybook/react';
import { ReservationCard } from '../components/reservation-card.js';
import type { ReservationRequest } from '../pages/my-reservations.tsx';

const mockReservationRequests: ReservationRequest[] = [
  {
    id: '1',
    state: 'REQUESTED',
    reservationPeriodStart: '2024-02-15T00:00:00Z',
    reservationPeriodEnd: '2024-02-22T00:00:00Z',
    createdAt: '2024-02-10T10:00:00Z',
    updatedAt: '2024-02-12T12:00:00Z',
    listingId: 'listing-1',
    reserverId: 'user-1',
    closeRequested: false,
    listing: {
      id: 'listing-1',
      title: 'Power Drill Set',
      imageUrl: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=300&h=200&fit=crop',
    },
    reserver: {
      id: 'user-1',
      firstName: 'Sarah',
      lastName: 'Johnson',
      name: 'Sarah Johnson',
    },
  },
  {
    id: '2',
    state: 'ACCEPTED',
    reservationPeriodStart: '2024-03-01T00:00:00Z',
    reservationPeriodEnd: '2024-03-05T00:00:00Z',
    createdAt: '2024-02-20T10:00:00Z',
    updatedAt: '2024-02-22T12:00:00Z',
    listingId: 'listing-2',
    reserverId: 'user-2',
    closeRequested: false,
    listing: {
      id: 'listing-2',
      title: 'Camping Tent',
      imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=300&h=200&fit=crop',
    },
    reserver: {
      id: 'user-2',
      firstName: 'Mike',
      lastName: 'Brown',
      name: 'Mike Brown',
    },
  },
  {
    id: '3',
    state: 'REJECTED',
    reservationPeriodStart: '2024-04-10T00:00:00Z',
    reservationPeriodEnd: '2024-04-15T00:00:00Z',
    createdAt: '2024-04-01T10:00:00Z',
    updatedAt: '2024-04-02T12:00:00Z',
    listingId: 'listing-3',
    reserverId: 'user-3',
    closeRequested: false,
    listing: {
      id: 'listing-3',
      title: 'Mountain Bike',
      imageUrl: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=300&h=200&fit=crop',
    },
    reserver: {
      id: 'user-3',
      firstName: 'Anna',
      lastName: 'Lee',
      name: 'Anna Lee',
    },
  },
  {
    id: '4',
    state: 'CANCELLED',
    reservationPeriodStart: '2024-05-01T00:00:00Z',
    reservationPeriodEnd: '2024-05-05T00:00:00Z',
    createdAt: '2024-04-20T10:00:00Z',
    updatedAt: '2024-04-22T12:00:00Z',
    listingId: 'listing-4',
    reserverId: 'user-4',
    closeRequested: false,
    listing: {
      id: 'listing-4',
      title: 'Kayak',
      imageUrl: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=300&h=200&fit=crop',
    },
    reserver: {
      id: 'user-4',
      firstName: 'Chris',
      lastName: 'Green',
      name: 'Chris Green',
    },
  },
  {
    id: '5',
    state: 'ACCEPTED',
    reservationPeriodStart: '2024-06-01T00:00:00Z',
    reservationPeriodEnd: '2024-06-05T00:00:00Z',
    createdAt: '2024-05-20T10:00:00Z',
    updatedAt: '2024-05-22T12:00:00Z',
    listingId: 'listing-5',
    reserverId: 'user-5',
    closeRequested: true,
    listing: {
      id: 'listing-5',
      title: 'GoPro Camera',
      imageUrl: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=200&fit=crop',
    },
    reserver: {
      id: 'user-5',
      firstName: 'Patricia',
      lastName: 'Black',
      name: 'Patricia Black',
    },
  },
];

const meta: Meta<typeof ReservationCard> = {
  title: 'Molecules/ReservationCard',
  component: ReservationCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    cancelLoading: {
      control: 'boolean',
    },
    closeLoading: {
      control: 'boolean',
    },
    showActions: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Requested: Story = {
  args: {
    reservation: mockReservationRequests[0]!, // REQUESTED status
    onCancel: (id: string) => console.log('Cancel clicked for:', id),
    onClose: (id: string) => console.log('Close clicked for:', id),
    onMessage: (id: string) => console.log('Message clicked for:', id),
  },
};

export const Accepted: Story = {
  args: {
    reservation: mockReservationRequests[1]!, // ACCEPTED status
    onCancel: (id: string) => console.log('Cancel clicked for:', id),
    onClose: (id: string) => console.log('Close clicked for:', id),
    onMessage: (id: string) => console.log('Message clicked for:', id),
  },
};

export const Rejected: Story = {
  args: {
    reservation: mockReservationRequests[2]!, // REJECTED status
    onCancel: (id: string) => console.log('Cancel clicked for:', id),
    onClose: (id: string) => console.log('Close clicked for:', id),
    onMessage: (id: string) => console.log('Message clicked for:', id),
  },
};

export const Cancelled: Story = {
  args: {
    reservation: mockReservationRequests[3]!, // CANCELLED status
    onCancel: (id: string) => console.log('Cancel clicked for:', id),
    onClose: (id: string) => console.log('Close clicked for:', id),
    onMessage: (id: string) => console.log('Message clicked for:', id),
  },
};

export const Closed: Story = {
  args: {
    reservation: mockReservationRequests[4]!, 
    onCancel: (id: string) => console.log('Cancel clicked for:', id),
    onClose: (id: string) => console.log('Close clicked for:', id),
    onMessage: (id: string) => console.log('Message clicked for:', id),
  },
};

export const WithoutActions: Story = {
  args: {
    reservation: mockReservationRequests[0]!,
    onCancel: (id: string) => console.log('Cancel clicked for:', id),
    onClose: (id: string) => console.log('Close clicked for:', id),
    onMessage: (id: string) => console.log('Message clicked for:', id),
    showActions: false,
  },
};

export const LoadingStates: Story = {
  args: {
    reservation: mockReservationRequests[0]!,
    onCancel: (id: string) => console.log('Cancel clicked for:', id),
    onClose: (id: string) => console.log('Close clicked for:', id),
    onMessage: (id: string) => console.log('Message clicked for:', id),
    cancelLoading: true,
  },
};