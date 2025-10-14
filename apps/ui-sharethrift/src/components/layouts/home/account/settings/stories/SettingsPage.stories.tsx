import type { Meta, StoryFn } from "@storybook/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthContext } from "react-oidc-context";
import { type ReactNode, useMemo } from "react";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { MockLink } from "@apollo/client/testing";
import HomeRoutes from "../../../index.tsx";
import { HomeAccountSettingsViewContainerCurrentUserDocument } from "../../../../../../generated.tsx";

export default {
  title: "Pages/Account/Settings",
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
            <MemoryRouter initialEntries={["/account/settings"]}>
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
          query: HomeAccountSettingsViewContainerCurrentUserDocument,
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
                    address1: "123 Main Street",
                    address2: "Apt 4B",
                    city: "Philadelphia",
                    state: "PA",
                    country: "United States",
                    zipCode: "19101",
                  },
                  billing: {
                    __typename: "PersonalUserAccountProfileBilling",
                    subscriptionId: "sub_123456789",
                    cybersourceCustomerId: "cust_abc123",
                  },
                },
              },
            },
          },
        },
      },
    ],
  },
};