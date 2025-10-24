import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { TermsPage } from "./terms-page.tsx";

const meta: Meta<typeof TermsPage> = {
  title: "Pages/Signup/Terms",
  component: TermsPage,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story: React.FC) => (
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
    (Story: React.FC) => (
      <MemoryRouter>
        <div>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};
