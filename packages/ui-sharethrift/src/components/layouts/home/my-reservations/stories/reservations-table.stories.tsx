import type { Meta, StoryObj } from '@storybook/react';
import { ReservationsTable } from '../components/reservations-table.tsx';
import type { ReservationRequest } from '../pages/my-reservations.container.tsx';
// Mock data moved here for storybook usage
const mockReservationRequests: ReservationRequest[] = [
  {
  id: '1',
  state: 'REQUESTED', // correct literal type
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
      firstName: 'John',
      lastName: 'Doe',
      name: 'John Doe',
    },
  },
  // ...add more mock reservations as needed
];

const getActiveReservations = (): ReservationRequest[] => mockReservationRequests.filter(r => ['REQUESTED', 'ACCEPTED', 'REJECTED', 'CANCELLED'].includes(r.state));
const getHistoryReservations = (): ReservationRequest[] => mockReservationRequests.filter(r => r.state === 'RESERVATION_PERIOD');

const meta: Meta<typeof ReservationsTable> = {
  title: 'Organisms/ReservationsTable',
  component: ReservationsTable,
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

export const AllReservations: Story = {
  args: {
    reservations: mockReservationRequests,
  onCancel: (id: string) => console.log('Cancel clicked for:', id),
  onClose: (id: string) => console.log('Close clicked for:', id),
  onMessage: (id: string) => console.log('Message clicked for:', id),
  },
};

export const ActiveReservations: Story = {
  args: {
    reservations: getActiveReservations(),
  onCancel: (id: string) => console.log('Cancel clicked for:', id),
  onClose: (id: string) => console.log('Close clicked for:', id),
  onMessage: (id: string) => console.log('Message clicked for:', id),
    emptyText: 'No active reservations found',
  },
};

export const HistoryReservations: Story = {
  args: {
    reservations: getHistoryReservations(),
  onCancel: (id: string) => console.log('Cancel clicked for:', id),
  onClose: (id: string) => console.log('Close clicked for:', id),
  onMessage: (id: string) => console.log('Message clicked for:', id),
    showActions: false,
    emptyText: 'No reservation history found',
  },
};

export const Empty: Story = {
  args: {
    reservations: [],
  onCancel: (id: string) => console.log('Cancel clicked for:', id),
  onClose: (id: string) => console.log('Close clicked for:', id),
  onMessage: (id: string) => console.log('Message clicked for:', id),
    emptyText: 'No reservations found',
  },
};

export const LoadingStates: Story = {
  args: {
    reservations: getActiveReservations(),
  onCancel: (id: string) => console.log('Cancel clicked for:', id),
  onClose: (id: string) => console.log('Close clicked for:', id),
  onMessage: (id: string) => console.log('Message clicked for:', id),
    cancelLoading: true,
  },
};