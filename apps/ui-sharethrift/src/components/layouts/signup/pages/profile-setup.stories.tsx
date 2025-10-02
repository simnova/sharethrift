import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { ProfileSetup } from "./profile-setup.tsx";

const meta: Meta<typeof ProfileSetup> = {
  title: "Pages/Signup/ProfileSetup",
  component: ProfileSetup,
  parameters: {
    layout: "fullscreen",
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

export const WithAvatar: Story = {
  decorators: [
    (Story: React.FC) => (
      <MemoryRouter>
        <div>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};
