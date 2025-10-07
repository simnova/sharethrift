import type { Meta, StoryFn } from "@storybook/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthContext } from "react-oidc-context";
import { type ReactNode, useMemo } from "react";
import HomeRoutes from "../../index.tsx";
import {
  HomeAccountProfileViewContainerCurrentUserDocument,
  HomeAccountProfileViewContainerUserListingsDocument,
} from "../../../../../generated.tsx";

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
} as Meta<typeof HomeRoutes>;

const Template: StoryFn<typeof HomeRoutes> = () => <HomeRoutes />;

export const DefaultView = Template.bind({});

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
              createdAt: "2024-08-01T00:00:00Z",
              updatedAt: "2025-08-08T12:00:00Z",
              account: {
                __typename: "PersonalUserAccount",
                accountType: "personal",
                email: "patrick.g@example.com",
                username: "patrick_g",
                profile: {
                  __typename: "PersonalUserAccountProfile",
                  firstName: "Patrick",
                  lastName: "Garcia",
                  location: {
                    __typename: "PersonalUserAccountProfileLocation",
                    city: "Philadelphia",
                    state: "PA",
                  },
                },
              },
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
                description: "Perfect city bike for commuting and leisure rides around the neighborhood.",
                category: "Vehicles & Transportation",
                location: "Philadelphia, PA",
                state: "Published",
                images: ["/assets/item-images/bike.png"],
                createdAt: "2024-08-01T00:00:00.000Z",
                updatedAt: "2025-08-08T12:00:00Z",
                sharingPeriodStart: "2024-08-11T00:00:00.000Z",
                sharingPeriodEnd: "2024-12-23T00:00:00.000Z",
                sharer: "Patrick G.",
              },
              {
                __typename: "ItemListing",
                id: "64f7a9c2d1e5b97f3c9d0a13",
                title: "Projector",
                description: "HD projector for movie nights and presentations.",
                category: "Electronics",
                location: "Philadelphia, PA",
                state: "Published",
                images: ["/assets/item-images/projector.png"],
                createdAt: "2024-08-13T00:00:00.000Z",
                updatedAt: "2025-08-08T11:30:00Z",
                sharingPeriodStart: "2024-08-13T00:00:00.000Z",
                sharingPeriodEnd: "2024-12-23T00:00:00.000Z",
                sharer: "Patrick G.",
              },
              {
                __typename: "ItemListing",
                id: "64f7a9c2d1e5b97f3c9d0a42",
                title: "Professional Camera",
                description: "High-quality DSLR camera for photography enthusiasts.",
                category: "Electronics",
                location: "Philadelphia, PA",
                state: "Published",
                images: ["/assets/item-images/camera.png"],
                createdAt: "2024-08-15T00:00:00.000Z",
                updatedAt: "2025-08-07T16:45:00Z",
                sharingPeriodStart: "2024-08-15T00:00:00.000Z",
                sharingPeriodEnd: "2024-12-23T00:00:00.000Z",
                sharer: "Patrick G.",
              },
            ],
          },
        },
      },
    ],
  },
};