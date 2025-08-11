import type { Meta, StoryObj } from '@storybook/react';
import { ReservationsView } from './reservations-view';
import { mockReservationRequests, getActiveReservations, getHistoryReservations } from '../../mocks/reservation-data';

const meta: Meta<typeof ReservationsView> = {
  title: 'Organisms/ReservationsView',
  component: ReservationsView,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Responsive reservations view that shows table on desktop and cards on mobile.',
      },
    },
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
    onCancel: (id) => console.log('Cancel clicked for:', id),
    onClose: (id) => console.log('Close clicked for:', id),
    onMessage: (id) => console.log('Message clicked for:', id),
  },
};

export const ActiveReservations: Story = {
  args: {
    reservations: getActiveReservations(),
    onCancel: (id) => console.log('Cancel clicked for:', id),
    onClose: (id) => console.log('Close clicked for:', id),
    onMessage: (id) => console.log('Message clicked for:', id),
    emptyText: 'No active reservations found',
  },
};

export const HistoryReservations: Story = {
  args: {
    reservations: getHistoryReservations(),
    onCancel: (id) => console.log('Cancel clicked for:', id),
    onClose: (id) => console.log('Close clicked for:', id),
    onMessage: (id) => console.log('Message clicked for:', id),
    showActions: false,
    emptyText: 'No reservation history found',
  },
};

export const Empty: Story = {
  args: {
    reservations: [],
    onCancel: (id) => console.log('Cancel clicked for:', id),
    onClose: (id) => console.log('Close clicked for:', id),
    onMessage: (id) => console.log('Message clicked for:', id),
    emptyText: 'No reservations found',
  },
};

export const LoadingStates: Story = {
  args: {
    reservations: getActiveReservations(),
    onCancel: (id) => console.log('Cancel clicked for:', id),
    onClose: (id) => console.log('Close clicked for:', id),
    onMessage: (id) => console.log('Message clicked for:', id),
    cancelLoading: true,
  },
};