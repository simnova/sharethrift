import type { Meta, StoryObj } from '@storybook/react';
import { MyReservationsContainerWithMocks } from './main-with-mocks.container';

const meta: Meta<typeof MyReservationsContainerWithMocks> = {
  title: 'Pages/MyReservations',
  component: MyReservationsContainerWithMocks,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Complete My Reservations page with atomic design components and mock data for preview.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    useMockData: {
      control: 'boolean',
      description: 'Whether to use mock data for component preview',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    userId: 'demo-user',
    useMockData: true,
  },
};

export const WithMockData: Story = {
  args: {
    userId: 'demo-user', 
    useMockData: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the page with mock reservation data for preview purposes.',
      },
    },
  },
};

export const WithoutMockData: Story = {
  args: {
    userId: 'demo-user',
    useMockData: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the page without mock data (empty state).',
      },
    },
  },
};