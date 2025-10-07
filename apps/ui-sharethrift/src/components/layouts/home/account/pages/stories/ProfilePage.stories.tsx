import type { Meta, StoryFn } from "@storybook/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthContext } from "react-oidc-context";
import { type ReactNode, useMemo } from "react";
import HomeRoutes from "../../../index.tsx";
import {
  HomeAccountProfileViewContainerCurrentUserDocument,
  HomeAccountProfileViewContainerUserListingsDocument,
} from "../../../../../../generated.tsx";
import { ProfileView } from "../profile-view.tsx";
import type { UserProfileData, UserListing } from "../profile-view.types.ts";

export default {
  title: "Pages/Account/Profile",
  component: HomeRoutes,
  decorators: [
    (Story) => (
      <MockAuthWrapper>
        <MemoryRouter initialEntries={["/account/profile"]}>
          <Routes>
            <Route path="*" element={<Story />} />
          </Routes>
        </MemoryRouter>
      </MockAuthWrapper>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    // Note: Using /account/profile route highlights 'Account' menu item in navigation
    // However, the submenu is not initially expanded due to how the navigation state is currently managed
  },
} as Meta<typeof HomeRoutes>;

// Mock authenticated user to bypass auth check in HomeRoutes
const MockAuthWrapper = ({ children }: { children: ReactNode }) => {
  const mockAuth: any = useMemo(
    () => ({
      isAuthenticated: true,
      isLoading: false,
      user: {
        profile: {
          sub: "507f1f77bcf86cd799439099",
          name: "Test User",
          email: "test@example.com",
        },
        access_token: "mock-access-token",
      },
      signinRedirect: async () => {},
      signoutRedirect: async () => {},
      removeUser: async () => {},
      events: {},
      settings: {},
    }),
    []
  );

  return (
    <AuthContext.Provider value={mockAuth}>{children}</AuthContext.Provider>
  );
};

const Template: StoryFn<typeof HomeRoutes> = () => <HomeRoutes />;

// Story: Default profile view with GraphQL mock data (3 listings)
export const DefaultView = Template.bind({});
DefaultView.parameters = {
  apolloClient: {
    mocks: [
      {
        request: {
          query: HomeAccountProfileViewContainerCurrentUserDocument,
        },
        result: {
          data: {
            currentPersonalUserAndCreateIfNotExists: {
              __typename: "PersonalUser",
              id: "507f1f77bcf86cd799439099",
              userType: "personal",
              account: {
                __typename: "PersonalUserAccount",
                accountType: "verified",
                email: "sarah.williams@example.com",
                username: "sarah_williams",
                profile: {
                  __typename: "PersonalUserAccountProfile",
                  firstName: "Sarah",
                  lastName: "Williams",
                  location: {
                    __typename: "Location",
                    city: "Philadelphia",
                    state: "PA",
                  },
                },
              },
              createdAt: "2024-01-15T10:00:00Z",
            },
          },
        },
      },
      {
        request: {
          query: HomeAccountProfileViewContainerUserListingsDocument,
        },
        result: {
          data: {
            itemListings: [
              {
                __typename: "ItemListing",
                id: "64f7a9c2d1e5b97f3c9d0a41",
                title: "City Bike",
                description:
                  "Perfect city bike for commuting and leisure rides around the neighborhood.",
                category: "Vehicles & Transportation",
                location: "Philadelphia, PA",
                state: "Published",
                images: ["/assets/item-images/bike.png"],
                createdAt: "2024-08-01T00:00:00.000Z",
                sharingPeriodStart: "2024-08-11T00:00:00.000Z",
                sharingPeriodEnd: "2024-12-23T00:00:00.000Z",
                sharer: "Sarah W.",
                updatedAt: "2024-08-15T00:00:00.000Z",
              },
              {
                __typename: "ItemListing",
                id: "64f7a9c2d1e5b97f3c9d0a13",
                title: "HD Projector",
                description: "HD projector for movie nights and presentations.",
                category: "Electronics",
                location: "Philadelphia, PA",
                state: "Published",
                images: ["/assets/item-images/projector.png"],
                createdAt: "2024-08-13T00:00:00.000Z",
                sharingPeriodStart: "2024-08-13T00:00:00.000Z",
                sharingPeriodEnd: "2024-12-23T00:00:00.000Z",
                sharer: "Sarah W.",
                updatedAt: "2024-08-20T00:00:00.000Z",
              },
              {
                __typename: "ItemListing",
                id: "64f7a9c2d1e5b97f3c9d0a25",
                title: "Camping Tent",
                description:
                  "4-person camping tent, perfect for weekend adventures.",
                category: "Sports & Outdoors",
                location: "Philadelphia, PA",
                state: "Published",
                images: ["/assets/item-images/tent.png"],
                createdAt: "2024-09-05T00:00:00.000Z",
                sharingPeriodStart: "2024-09-10T00:00:00.000Z",
                sharingPeriodEnd: "2024-11-30T00:00:00.000Z",
                sharer: "Sarah W.",
                updatedAt: "2024-09-06T00:00:00.000Z",
              },
            ],
          },
        },
      },
    ],
  },
};

// ========================================
// COMPONENT-ONLY STORIES (isolated testing)
// These show just the ProfileView component
// ========================================

const ComponentTemplate: StoryFn<{
  user: UserProfileData;
  listings: UserListing[];
}> = ({ user, listings }) => (
  <ProfileView
    user={user}
    listings={listings}
    isOwnProfile={true}
    onEditSettings={() => console.log("Navigate to settings")}
    onListingClick={(listingId: string) =>
      console.log("Navigate to listing:", listingId)
    }
  />
);

const mockUserComplete: UserProfileData = {
  id: "507f1f77bcf86cd799439099",
  firstName: "Sarah",
  lastName: "Williams",
  username: "sarah_williams",
  email: "sarah.williams@example.com",
  accountType: "verified",
  location: {
    city: "Philadelphia",
    state: "PA",
  },
  createdAt: "2024-01-15T10:00:00Z",
};

const mockListingsMultiple: UserListing[] = [
  {
    id: "64f7a9c2d1e5b97f3c9d0a41",
    title: "City Bike",
    description:
      "Perfect city bike for commuting and leisure rides around the neighborhood.",
    category: "Vehicles & Transportation",
    location: "Philadelphia, PA",
    state: "Published",
    images: ["/assets/item-images/bike.png"],
    createdAt: "2024-08-01T00:00:00.000Z",
    sharingPeriodStart: "2024-08-11T00:00:00.000Z",
    sharingPeriodEnd: "2024-12-23T00:00:00.000Z",
  },
  {
    id: "64f7a9c2d1e5b97f3c9d0a13",
    title: "HD Projector",
    description: "HD projector for movie nights and presentations.",
    category: "Electronics",
    location: "Philadelphia, PA",
    state: "Published",
    images: ["/assets/item-images/projector.png"],
    createdAt: "2024-08-13T00:00:00.000Z",
    sharingPeriodStart: "2024-08-13T00:00:00.000Z",
    sharingPeriodEnd: "2024-12-23T00:00:00.000Z",
  },
];

// Story: Component with two listings
export const WithTwoListings = ComponentTemplate.bind({});
WithTwoListings.args = {
  user: mockUserComplete,
  listings: mockListingsMultiple,
};

// Story: Component with no listings (new user empty state)
export const NoListings = ComponentTemplate.bind({});
NoListings.args = {
  user: {
    id: "507f1f77bcf86cd799439102",
    firstName: "Alex",
    lastName: "Smith",
    username: "new_user",
    email: "new.user@example.com",
    accountType: "non-verified",
    location: {
      city: "Boston",
      state: "MA",
    },
    createdAt: "2025-10-01T08:00:00Z",
  },
  listings: [],
};
