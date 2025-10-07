import type { Meta, StoryFn } from "@storybook/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthContext } from "react-oidc-context";
import { type ReactNode, useMemo } from "react";
import HomeRoutes from "../../../index.tsx";
import { HomeAccountSettingsViewContainerCurrentUserDocument } from "../../../../../../generated.tsx";

export default {
  title: "Pages/Account/Settings",
  component: HomeRoutes,
  decorators: [
    (Story) => (
      <MockAuthWrapper>
        <MemoryRouter initialEntries={["/account/settings"]}>
          <Routes>
            <Route path="*" element={<Story />} />
          </Routes>
        </MemoryRouter>
      </MockAuthWrapper>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    // Note: Using /account/settings route highlights 'Account' menu item in navigation
    // Similar to how /messages highlights 'Messages' menu item
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

// Story: Complete user profile with all fields filled (Verified account)
export const CompleteProfile = Template.bind({});
CompleteProfile.parameters = {
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
                    address1: "123 Main Street",
                    address2: "Apt 4B",
                    city: "Philadelphia",
                    state: "PA",
                    country: "United States",
                    zipCode: "19105",
                  },
                  billing: undefined,
                },
              },
              createdAt: "2024-01-15T10:00:00Z",
              updatedAt: "2025-10-01T08:30:00Z",
            },
          },
        },
      },
    ],
  },
};

// Story: Partial user profile
export const PartialProfile = Template.bind({});
PartialProfile.parameters = {
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
              id: "507f1f77bcf86cd799439101",
              userType: "personal",
              account: {
                __typename: "PersonalUserAccount",
                accountType: "verified-plus", // Note: Plan selection not yet dynamic
                email: "john.doe@example.com",
                username: "john_doe",
                profile: {
                  __typename: "PersonalUserAccountProfile",
                  firstName: "John",
                  lastName: "Doe",
                  location: {
                    __typename: "Location",
                    address1: undefined,
                    address2: undefined,
                    city: "New York",
                    state: "NY",
                    country: "United States",
                    zipCode: undefined,
                  },
                  billing: undefined,
                },
              },
              createdAt: "2024-06-20T14:30:00Z",
              updatedAt: "2025-09-15T11:20:00Z",
            },
          },
        },
      },
    ],
  },
};

// Story: Account with billing information (Billing to be implemented in settings-view)
export const WithBillingInfo = Template.bind({});
WithBillingInfo.parameters = {
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
              id: "507f1f77bcf86cd799439102",
              userType: "personal",
              account: {
                __typename: "PersonalUserAccount",
                accountType: "verified-plus", // Note: Plan selection implemented in settings-view
                email: "emma.davis@example.com",
                username: "emma_davis",
                profile: {
                  __typename: "PersonalUserAccountProfile",
                  firstName: "Emma",
                  lastName: "Davis",
                  location: {
                    __typename: "Location",
                    address1: "456 Oak Avenue",
                    address2: undefined,
                    city: "Boston",
                    state: "MA",
                    country: "United States",
                    zipCode: "02108",
                  },
                  billing: {
                    __typename: "Billing",
                    subscriptionId: "sub_1a2b3c4d5e6f",
                    cybersourceCustomerId: "cust_xyz789abc123",
                  },
                },
              },
              createdAt: "2024-03-10T15:00:00Z",
              updatedAt: "2025-10-05T14:20:00Z",
            },
          },
        },
      },
    ],
  },
};
