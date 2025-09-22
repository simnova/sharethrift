import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import AccountSetup from './AccountSetup';

const meta: Meta<typeof AccountSetup> = {
  title: 'Pages/Signup/AccountSetup',
  component: AccountSetup,
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

export const WithPrefilledData: Story = {
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