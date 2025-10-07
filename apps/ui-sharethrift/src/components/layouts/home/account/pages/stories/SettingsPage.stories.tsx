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
  accountType: "verified",
  location: {
    address1: "123 Main Street",
    address2: "Apt 4B",
    city: "Philadelphia",
    state: "PA",
    country: "United States",
    zipCode: "19103",
  },
  billing: {
    subscriptionId: "sub_1234567890",
    cybersourceCustomerId: "cust_abc123xyz",
  },
  createdAt: "2024-01-15T10:00:00Z",
};

// Mock user with minimal profile information
const mockUserMinimal: SettingsUser = {
  id: "507f1f77bcf86cd799439100",
  firstName: "",
  lastName: "",
  username: "new_user",
  email: "new.user@example.com",
  accountType: "non-verified",
  location: {},
  createdAt: "2025-10-01T08:00:00Z",
};

// Mock user with partial profile information
const mockUserPartial: SettingsUser = {
  id: "507f1f77bcf86cd799439101",
  firstName: "John",
  lastName: "Doe",
  username: "john_doe",
  email: "john.doe@example.com",
  accountType: "verified-plus",
  location: {
    city: "New York",
    state: "NY",
    country: "United States",
  },
  billing: {
    subscriptionId: "sub_0987654321",
  },
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

// Story: Minimal user profile (new user with incomplete information)
export const MinimalProfile = Template.bind({});
MinimalProfile.args = {
  user: mockUserMinimal,
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

// Story: User without billing information
export const NoBillingInfo = Template.bind({});
NoBillingInfo.args = {
  user: {
    ...mockUserComplete,
    billing: undefined,
  },
  onEditSection: (section: string) => console.log("Edit section:", section),
  onChangePassword: () => console.log("Change password clicked"),
};
