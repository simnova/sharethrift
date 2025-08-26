import type { Meta, StoryObj } from '@storybook/react';
import MyReservationsMain from '../pages/my-reservations';

const meta: Meta<typeof MyReservationsMain> = {
  title: 'Pages/MyReservations/Main',
  component: MyReservationsMain,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    userId: 'storybook-user',
  },
};

export const Loading: Story = {
  args: {
    userId: 'storybook-user',
  },
};

export const reservationError: Story = {
  args: {
    userId: 'storybook-user',
  },
};

export const Empty: Story = {
  args: {
    userId: 'storybook-user',
  },
};