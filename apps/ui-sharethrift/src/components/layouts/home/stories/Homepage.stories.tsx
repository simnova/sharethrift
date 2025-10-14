import type { Meta, StoryFn } from "@storybook/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthContext } from "react-oidc-context";
import { type ReactNode, useMemo } from "react";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { MockLink } from "@apollo/client/testing";
import HomeRoutes from "../index.tsx";
import { ListingsPageContainerGetListingsDocument } from "../../../../generated.tsx";

export default {
  title: "Pages/Home",
  component: HomeRoutes,
  decorators: [
    (Story, context) => {
      const mocks = context.parameters['apolloClient']?.mocks || [];
      const mockLink = new MockLink(mocks);
      const client = new ApolloClient({
        link: mockLink,
        cache: new InMemoryCache(),
      });
      
      return (
        <ApolloProvider client={client}>
          <MockAuthWrapper>
            <MemoryRouter initialEntries={["/home"]}>
              <Routes>
                <Route path="*" element={<Story />} />
              </Routes>
            </MemoryRouter>
          </MockAuthWrapper>
        </ApolloProvider>
      );
    },
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
          query: ListingsPageContainerGetListingsDocument,
          variables: {},
        },
        result: {
          data: {
            itemListings: [
              {
                __typename: "ItemListing",
                id: "64f7a9c2d1e5b97f3c9d0a41",
                title: "City Bike",
                description: "Perfect for city commuting.",
                category: "Sports & Recreation",
                location: "Philadelphia, PA",
                state: "Published",
                images: ["/assets/item-images/bike.png"],
                createdAt: "2025-08-08T10:00:00Z",
                updatedAt: "2025-08-08T12:00:00Z",
                sharingPeriodStart: "2025-08-10T00:00:00Z",
                sharingPeriodEnd: "2025-08-17T00:00:00Z",
                schemaVersion: "1",
                version: 1,
                reports: 0,
                sharingHistory: [],
                sharer: {
                  __typename: "PersonalUser",
                  id: "507f1f77bcf86cd799439011",
                  account: {
                    __typename: "PersonalUserAccount",
                    username: "alice_johnson",
                    profile: {
                      __typename: "PersonalUserAccountProfile",
                      firstName: "Alice",
                      lastName: "Johnson",
                    },
                  },
                },
              },
              {
                __typename: "ItemListing",
                id: "64f7a9c2d1e5b97f3c9d0a42",
                title: "AirPods Pro",
                description: "Perfect for music and calls.",
                category: "Electronics",
                location: "New York, NY",
                state: "Published",
                images: ["/assets/item-images/airpods.png"],
                createdAt: "2025-08-07T10:00:00Z",
                updatedAt: "2025-08-07T12:00:00Z",
                sharingPeriodStart: "2025-08-09T00:00:00Z",
                sharingPeriodEnd: "2025-08-16T00:00:00Z",
                schemaVersion: "1",
                version: 1,
                reports: 0,
                sharingHistory: [],
                sharer: {
                  __typename: "PersonalUser",
                  id: "507f1f77bcf86cd799439022",
                  account: {
                    __typename: "PersonalUserAccount",
                    username: "bob_smith",
                    profile: {
                      __typename: "PersonalUserAccountProfile",
                      firstName: "Bob",
                      lastName: "Smith",
                    },
                  },
                },
              },
              {
                __typename: "ItemListing",
                id: "64f7a9c2d1e5b97f3c9d0a43",
                title: "Camping Tent",
                description: "Perfect for outdoor camping adventures.",
                category: "Sports & Recreation",
                location: "Boston, MA",
                state: "Published",
                images: ["/assets/item-images/tent.png"],
                createdAt: "2025-08-06T10:00:00Z",
                updatedAt: "2025-08-06T12:00:00Z",
                sharingPeriodStart: "2025-08-08T00:00:00Z",
                sharingPeriodEnd: "2025-08-15T00:00:00Z",
                schemaVersion: "1",
                version: 1,
                reports: 0,
                sharingHistory: [],
                sharer: {
                  __typename: "PersonalUser",
                  id: "507f1f77bcf86cd799439033",
                  account: {
                    __typename: "PersonalUserAccount",
                    username: "carol_white",
                    profile: {
                      __typename: "PersonalUserAccountProfile",
                      firstName: "Carol",
                      lastName: "White",
                    },
                  },
                },
              },
            ],
          },
        },
      },
    ],
  },
};
