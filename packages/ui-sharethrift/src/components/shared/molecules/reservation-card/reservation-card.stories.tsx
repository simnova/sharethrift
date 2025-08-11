import type { Meta, StoryObj } from '@storybook/react';
import { ReservationCard } from './reservation-card';
import { mockReservationRequests } from '../../mocks/reservation-data';

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
    reservation: mockReservationRequests[0], // REQUESTED status
    onCancel: (id) => console.log('Cancel clicked for:', id),
    onClose: (id) => console.log('Close clicked for:', id),
    onMessage: (id) => console.log('Message clicked for:', id),
  },
};

export const Accepted: Story = {
  args: {
    reservation: mockReservationRequests[1], // ACCEPTED status
    onCancel: (id) => console.log('Cancel clicked for:', id),
    onClose: (id) => console.log('Close clicked for:', id),
    onMessage: (id) => console.log('Message clicked for:', id),
  },
};

export const Rejected: Story = {
  args: {
    reservation: mockReservationRequests[2], // REJECTED status
    onCancel: (id) => console.log('Cancel clicked for:', id),
    onClose: (id) => console.log('Close clicked for:', id),
    onMessage: (id) => console.log('Message clicked for:', id),
  },
};

export const Cancelled: Story = {
  args: {
    reservation: mockReservationRequests[3], // CANCELLED status
    onCancel: (id) => console.log('Cancel clicked for:', id),
    onClose: (id) => console.log('Close clicked for:', id),
    onMessage: (id) => console.log('Message clicked for:', id),
  },
};

export const Closed: Story = {
  args: {
    reservation: mockReservationRequests[4], // RESERVATION_PERIOD status
    onCancel: (id) => console.log('Cancel clicked for:', id),
    onClose: (id) => console.log('Close clicked for:', id),
    onMessage: (id) => console.log('Message clicked for:', id),
  },
};

export const WithoutActions: Story = {
  args: {
    reservation: mockReservationRequests[0],
    onCancel: (id) => console.log('Cancel clicked for:', id),
    onClose: (id) => console.log('Close clicked for:', id),
    onMessage: (id) => console.log('Message clicked for:', id),
    showActions: false,
  },
};

export const LoadingStates: Story = {
  args: {
    reservation: mockReservationRequests[0],
    onCancel: (id) => console.log('Cancel clicked for:', id),
    onClose: (id) => console.log('Close clicked for:', id),
    onMessage: (id) => console.log('Message clicked for:', id),
    cancelLoading: true,
  },
};