import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { expect, within } from "storybook/test";
import type { ComponentProps } from "react";
import { ListingBanner } from "../components/listing-banner.tsx";
import type { PersonalUser } from "../../../../../generated.tsx";

type ListingBannerStoryProps = ComponentProps<typeof ListingBanner>;

// Mock PersonalUser object for Storybook
const mockUser: PersonalUser = {
  id: "507f1f77bcf86cd799439011",
  __typename: "PersonalUser",
  account: {
    __typename: "PersonalUserAccount",
    email: "alice@example.com",
    username: "alice_doe",
    profile: {
      __typename: "PersonalUserAccountProfile",
      firstName: "Alice",
      lastName: "Doe",
    },
  },
  userType: "personal-user",
  hasCompletedOnboarding: true,
  isBlocked: false,
};

const mockUserWithoutProfile: PersonalUser = {
  id: "507f1f77bcf86cd799439012",
  __typename: "PersonalUser",
  account: {
    __typename: "PersonalUserAccount",
    email: "unknown@example.com",
    username: "unknown_user",
    profile: undefined,
  },
  userType: "personal-user",
  hasCompletedOnboarding: false,
  isBlocked: false,
} as unknown as PersonalUser;

const meta: Meta<typeof ListingBanner> = {
  title: "Components/Listings/ListingBanner",
  component: ListingBanner,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof ListingBanner>;

export const Default: Story = {
  args: {
    owner: mockUser,
  } satisfies ListingBannerStoryProps,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test owner name display
    await expect(canvas.getByText("Alice's Listing")).toBeInTheDocument();
    await expect(canvas.getByText("Alice")).toBeInTheDocument();

    // Test request period
    await expect(canvas.getByText("Request Period:")).toBeInTheDocument();
    await expect(canvas.getByText("1 Month")).toBeInTheDocument();

    // Test status
    await expect(canvas.getByText("Request Submitted")).toBeInTheDocument();

    // Test profile link
    const profileLink = canvas.getByRole("link", { name: "Alice" });
    await expect(profileLink).toBeInTheDocument();
    await expect(profileLink).toHaveAttribute("href", "/user/507f1f77bcf86cd799439011");
  },
};

export const UnknownOwner: Story = {
  args: {
    owner: mockUserWithoutProfile,
  } satisfies ListingBannerStoryProps,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test fallback for missing profile
    await expect(canvas.getByText("unknown_user's Listing")).toBeInTheDocument();
  },
};
