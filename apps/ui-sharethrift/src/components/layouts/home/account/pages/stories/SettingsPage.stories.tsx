import type { Meta, StoryFn } from "@storybook/react";
import { SettingsView } from "../settings-view.tsx";
import type { SettingsUser } from "../settings-view.types.ts";

export default {
  title: "Pages/Account/Settings",
  component: SettingsView,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof SettingsView>;

// Mock user data with complete profile information
const mockUserComplete: SettingsUser = {
  id: "507f1f77bcf86cd799439099",
  firstName: "Sarah",
  lastName: "Williams",
  username: "sarah_williams",
  email: "sarah.williams@example.com",
  accountType: "verified-plus",
  location: {
    address1: "123 Main Street",
    address2: "Apt 4B",
    city: "Philadelphia",
    state: "PA",
    country: "United States",
    zipCode: "19105",
  },
  createdAt: "2024-01-15T10:00:00Z",
};

// Mock user with partial profile information
const mockUserPartial: SettingsUser = {
  id: "507f1f77bcf86cd799439101",
  firstName: "Jason",
  lastName: "H",
  username: "jay_hank",
  email: "jay.hank@example.com",
  accountType: "verified",
  location: {
    city: "New York",
    state: "NY",
    country: "United States",
  },
  billing: undefined,
  createdAt: "2024-06-20T14:30:00Z",
};

const Template: StoryFn<typeof SettingsView> = (args) => (
  <SettingsView {...args} />
);

// Story: Complete user profile with all fields filled
export const CompleteProfile = Template.bind({});
CompleteProfile.args = {
  user: mockUserComplete,
  onEditSection: (section: string) => console.log("Edit section:", section),
  onChangePassword: () => console.log("Change password clicked"),
};

// Story: Partial user profile (some fields filled)
export const PartialProfile = Template.bind({});
PartialProfile.args = {
  user: mockUserPartial,
  onEditSection: (section: string) => console.log("Edit section:", section),
  onChangePassword: () => console.log("Change password clicked"),
};

// Story: User with billing information (commented out for future reference)
// NOTE: Billing display is not yet implemented in settings-view.tsx
export const WithBillingInfo = Template.bind({});
WithBillingInfo.args = {
  user: {
    ...mockUserComplete,
    billing: {
      subscriptionId: "sub_1234567890",
      cybersourceCustomerId: "cust_abc123xyz",
    },
  },
  onEditSection: (section: string) => console.log("Edit section:", section),
  onChangePassword: () => console.log("Change password clicked"),
};
