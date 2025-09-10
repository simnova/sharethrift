import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import Terms from './Terms';

const meta: Meta<typeof Terms> = {
  title: 'Pages/Signup/Terms',
  component: Terms,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutNotifications: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};