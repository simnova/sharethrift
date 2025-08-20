import type { Meta, StoryObj } from '@storybook/react';
import MyReservationsMain from './Main';

const meta: Meta<typeof MyReservationsMain> = {
  title: 'Pages/MyReservations/Main',
  component: MyReservationsMain,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockActiveReservations = [
  {
    id: '1',
    state: 'REQUESTED' as const,
    reservationPeriodStart: '2024-01-15',
    reservationPeriodEnd: '2024-01-20',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
    listingId: 'listing1',
    reserverId: 'user1',
    closeRequested: false,
    listing: {
      id: 'listing1',
      title: 'Professional Camera',
      imageUrl: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=200&fit=crop',
    },
    reserver: {
      id: 'user1',
      firstName: 'John',
      lastName: 'Doe',
      name: 'John Doe',
    },
  },
  {
    id: '2',
    state: 'ACCEPTED' as const,
    reservationPeriodStart: '2024-01-25',
    reservationPeriodEnd: '2024-01-30',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-13',
    listingId: 'listing2',
    reserverId: 'user1',
    closeRequested: false,
    listing: {
      id: 'listing2',
      title: 'Professional Microphone',
      imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=300&h=200&fit=crop',
    },
    reserver: {
      id: 'user1',
      firstName: 'John',
      lastName: 'Doe',
      name: 'John Doe',
    },
  },
  {
    id: '3',
    state: 'REJECTED' as const,
    reservationPeriodStart: '2024-02-01',
    reservationPeriodEnd: '2024-02-05',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-21',
    listingId: 'listing3',
    reserverId: 'user1',
    closeRequested: false,
    listing: {
      id: 'listing3',
      title: 'Drone with 4K Camera',
      imageUrl: 'https://images.unsplash.com/photo-1508614349301-e34f9d2172d4?w=300&h=200&fit=crop',
    },
    reserver: {
      id: 'user1',
      firstName: 'John',
      lastName: 'Doe',
      name: 'John Doe',
    },
  },
];

const mockHistoryReservations = [
  {
    id: '4',
    state: 'RESERVATION_PERIOD' as const,
    reservationPeriodStart: '2023-12-01',
    reservationPeriodEnd: '2023-12-05',
    createdAt: '2023-11-25',
    updatedAt: '2023-12-06',
    listingId: 'listing4',
    reserverId: 'user1',
    closeRequested: true,
    listing: {
      id: 'listing4',
      title: 'Vintage Film Camera',
      imageUrl: 'https://images.unsplash.com/photo-1606983340902-b37ce7d7e8e0?w=300&h=200&fit=crop',
    },
    reserver: {
      id: 'user1',
      firstName: 'John',
      lastName: 'Doe',
      name: 'John Doe',
    },
  },
  {
    id: '5',
    state: 'RESERVATION_PERIOD' as const,
    reservationPeriodStart: '2023-11-15',
    reservationPeriodEnd: '2023-11-20',
    createdAt: '2023-11-10',
    updatedAt: '2023-11-21',
    listingId: 'listing5',
    reserverId: 'user1',
    closeRequested: true,
    listing: {
      id: 'listing5',
      title: 'Audio Recording Equipment',
      imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop',
    },
    reserver: {
      id: 'user1',
      firstName: 'John',
      lastName: 'Doe',
      name: 'John Doe',
    },
  },
];

export const Default: Story = {
  args: {
    activeReservations: mockActiveReservations,
    historyReservations: mockHistoryReservations,
    loading: false,
    error: null,
    onCancel: () => console.log('Cancel clicked'),
    onClose: () => console.log('Close clicked'),
    onMessage: () => console.log('Message clicked'),
    cancelLoading: false,
    closeLoading: false,
  },
};

export const Loading: Story = {
  args: {
    activeReservations: [],
    historyReservations: [],
    loading: true,
    error: null,
    onCancel: () => console.log('Cancel clicked'),
    onClose: () => console.log('Close clicked'),
    onMessage: () => console.log('Message clicked'),
    cancelLoading: false,
    closeLoading: false,
  },
};

export const reservationError: Story = {
  args: {
    activeReservations: [],
    historyReservations: [],
    loading: false,
    error: new Error('Failed to load reservations'),
    onCancel: () => console.log('Cancel clicked'),
    onClose: () => console.log('Close clicked'),
    onMessage: () => console.log('Message clicked'),
    cancelLoading: false,
    closeLoading: false,
  },
};

export const Empty: Story = {
  args: {
    activeReservations: [],
    historyReservations: [],
    loading: false,
    error: null,
    onCancel: () => console.log('Cancel clicked'),
    onClose: () => console.log('Close clicked'),
    onMessage: () => console.log('Message clicked'),
    cancelLoading: false,
    closeLoading: false,
  },
};