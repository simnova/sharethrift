import type { Meta, StoryObj } from '@storybook/react';
import { ReservationCard, type ReservationData } from './index.js';

// Mock data for stories
const mockReservationPending: ReservationData = {
  id: '1',
  listing: {
    id: 'listing-1',
    title: 'Mountain Bike - Trek X-Caliber 8',
    description: 'Perfect for trails and city riding',
    imageUrl: '/src/assets/item-images/bike.png',
  },
  reserver: {
    id: 'user-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
  },
  status: 'pending',
  reservationPeriodStart: '2024-03-15T00:00:00Z',
  reservationPeriodEnd: '2024-03-20T00:00:00Z',
  requestedOn: '2024-03-10T10:30:00Z',
};

const mockReservationAccepted: ReservationData = {
  ...mockReservationPending,
  id: '2',
  status: 'accepted',
  listing: {
    ...mockReservationPending.listing,
    title: 'Camping Tent - 4 Person',
    imageUrl: '/src/assets/item-images/tent.png',
  },
  reserver: {
    ...mockReservationPending.reserver,
    firstName: 'Jane',
    lastName: 'Smith',
  },
};

const meta: Meta<typeof ReservationCard> = {
  title: 'Molecules/ReservationCard',
  component: ReservationCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultHandlers = {
  onAccept: (id: string) => console.log('Accept reservation:', id),
  onReject: (id: string) => console.log('Reject reservation:', id),
  onCancel: (id: string) => console.log('Cancel reservation:', id),
  onClose: (id: string) => console.log('Close reservation:', id),
  onMessage: (id: string) => console.log('Message for reservation:', id),
};

export const Pending: Story = {
  args: {
    reservation: mockReservationPending,
    ...defaultHandlers,
  },
};

export const Accepted: Story = {
  args: {
    reservation: mockReservationAccepted,
    ...defaultHandlers,
  },
};

export const Rejected: Story = {
  args: {
    reservation: {
      ...mockReservationPending,
      id: '3',
      status: 'rejected',
      listing: {
        ...mockReservationPending.listing,
        title: 'AirPods Pro - 2nd Generation',
        imageUrl: '/src/assets/item-images/airpods.png',
      },
    },
    ...defaultHandlers,
  },
};

export const Cancelled: Story = {
  args: {
    reservation: {
      ...mockReservationPending,
      id: '4',
      status: 'cancelled',
      listing: {
        ...mockReservationPending.listing,
        title: 'Bubble Chair - Modern Design',
        imageUrl: '/src/assets/item-images/bubble-chair.png',
      },
    },
    ...defaultHandlers,
  },
};

export const Closing: Story = {
  args: {
    reservation: {
      ...mockReservationPending,
      id: '5',
      status: 'closing',
      listing: {
        ...mockReservationPending.listing,
        title: 'Hammock - Portable Outdoor',
        imageUrl: '/src/assets/item-images/hammock.png',
      },
    },
    ...defaultHandlers,
  },
};

export const Closed: Story = {
  args: {
    reservation: {
      ...mockReservationPending,
      id: '6',
      status: 'closed',
      listing: {
        ...mockReservationPending.listing,
        title: 'Projector - 4K Mini Portable',
        imageUrl: '/src/assets/item-images/projector.png',
      },
    },
    ...defaultHandlers,
  },
};

export const WithoutActions: Story = {
  args: {
    reservation: mockReservationPending,
    showActions: false,
  },
};

export const WithLoading: Story = {
  args: {
    reservation: mockReservationPending,
    loading: {
      accept: true,
    },
    ...defaultHandlers,
  },
};

export const LongTitles: Story = {
  args: {
    reservation: {
      ...mockReservationPending,
      listing: {
        ...mockReservationPending.listing,
        title: 'Very Long Item Title That Should Be Truncated When It Exceeds The Available Space',
      },
      reserver: {
        ...mockReservationPending.reserver,
        firstName: 'VeryLongFirstName',
        lastName: 'VeryLongLastNameThatMightOverflow',
      },
    },
    ...defaultHandlers,
  },
};