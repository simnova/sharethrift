import type { Meta, StoryObj } from "@storybook/react";
import { SelectAccountTypePage } from "./select-account-type-page.tsx";
import { BrowserRouter } from "react-router-dom";

const meta: Meta<typeof SelectAccountTypePage> = {
  title: "Signup/SelectAccountType",
  component: SelectAccountTypePage,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const PersonalAccountSelected: Story = {
  name: "Personal Account Tab",
};

export const BusinessAccountSelected: Story = {
  name: "Business Account Tab",
  play: async () => {
    // This would automatically select the business tab when the story loads
    // Implementation would require user interactions in Storybook
  },
};

export const EnterpriseAccountSelected: Story = {
  name: "Enterprise Account Tab",
  play: async () => {
    // This would automatically select the enterprise tab when the story loads
    // Implementation would require user interactions in Storybook
  },
};
