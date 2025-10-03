import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { AccountSetupPage } from "./account-setup-page.tsx";
import type React from "react";

const meta: Meta<typeof AccountSetupPage> = {
  title: "Pages/Signup/AccountSetup",
  component: AccountSetupPage,
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

export const WithPrefilledData: Story = {
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
