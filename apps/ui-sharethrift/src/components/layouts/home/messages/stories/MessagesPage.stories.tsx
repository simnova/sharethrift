import type { Meta, StoryFn } from "@storybook/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthContext } from "react-oidc-context";
import { type ReactNode, useMemo } from "react";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { MockLink } from "@apollo/client/testing";
import HomeRoutes from "../../index.tsx";
import {
  HomeConversationListContainerConversationsByUserDocument,
  ConversationBoxContainerConversationDocument,
} from "../../../../../generated.tsx";

export default {
  title: "Pages/Messages",
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
            <MemoryRouter initialEntries={["/messages"]}>
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

// Mock authenticated user to bypass auth check in HomeRoutes
// NOTE: We cannot use AuthProvider directly because it requires a real OIDC server.
// AuthProvider from react-oidc-context attempts to connect to the authority URL,
// perform OAuth2/OIDC flows, and validate tokens. Since we're using a fake authority
// (https://mock-authority.com), the authentication fails and useAuth() returns
// isAuthenticated: false, causing Navigation to not render. Instead, we use
// AuthContext.Provider directly with a mocked auth object that has isAuthenticated: true.

const MockAuthWrapper = ({ children }: { children: ReactNode }) => {
  // Create a mocked auth context that simulates an authenticated user
  // We cast as 'any' to avoid TypeScript errors with the full AuthContextProps interface
  // HOW THIS EXPOSES useAuth():
  // When any child component calls useAuth(), it uses React's useContext(AuthContext) internally.
  // By wrapping with <AuthContext.Provider value={mockAuth}>, we're providing the mock data to
  // that context. So when HomeRoutes calls useAuth(), it receives our mockAuth object with
  // isAuthenticated: true instead of the default false from a failed AuthProvider.
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
          query: HomeConversationListContainerConversationsByUserDocument,
          variables: {
            userId: "507f1f77bcf86cd799439099",
          },
        },
        result: {
          data: {
            conversationsByUser: [
              {
                __typename: "Conversation",
                id: "64f7a9c2d1e5b97f3c9d0c01",
                twilioConversationId: "CH123",
                createdAt: "2025-08-08T10:00:00Z",
                updatedAt: "2025-08-08T12:00:00Z",
                sharer: {
                  __typename: "PersonalUser",
                  id: "507f1f77bcf86cd799439011",
                  account: {
                    __typename: "PersonalUserAccount",
                    profile: {
                      __typename: "PersonalUserAccountProfile",
                      firstName: "Alice",
                      lastName: "Johnson",
                    },
                  },
                },
                reserver: {
                  __typename: "PersonalUser",
                  id: "507f1f77bcf86cd799439099",
                  account: {
                    __typename: "PersonalUserAccount",
                    profile: {
                      __typename: "PersonalUserAccountProfile",
                      firstName: "Current",
                      lastName: "User",
                    },
                  },
                },
                listing: {
                  __typename: "ItemListing",
                  id: "64f7a9c2d1e5b97f3c9d0a41",
                  title: "City Bike",
                  images: ["/assets/item-images/bike.png"],
                },
              },
              {
                __typename: "Conversation",
                id: "64f7a9c2d1e5b97f3c9d0c02",
                twilioConversationId: "CH124",
                createdAt: "2025-08-07T09:00:00Z",
                updatedAt: "2025-08-08T11:30:00Z",
                sharer: {
                  __typename: "PersonalUser",
                  id: "507f1f77bcf86cd799439022",
                  account: {
                    __typename: "PersonalUserAccount",
                    profile: {
                      __typename: "PersonalUserAccountProfile",
                      firstName: "Bob",
                      lastName: "Smith",
                    },
                  },
                },
                reserver: {
                  __typename: "PersonalUser",
                  id: "507f1f77bcf86cd799439099",
                  account: {
                    __typename: "PersonalUserAccount",
                    profile: {
                      __typename: "PersonalUserAccountProfile",
                      firstName: "Current",
                      lastName: "User",
                    },
                  },
                },
                listing: {
                  __typename: "ItemListing",
                  id: "64f7a9c2d1e5b97f3c9d0a42",
                  title: "Professional Camera",
                  images: ["/assets/item-images/camera.png"],
                },
              },
            ],
          },
        },
      },
      {
        request: {
          query: ConversationBoxContainerConversationDocument,
          variables: {
            conversationId: "64f7a9c2d1e5b97f3c9d0c01",
          },
        },
        result: {
          data: {
            conversation: {
              __typename: "Conversation",
              id: "64f7a9c2d1e5b97f3c9d0c01",
              twilioConversationId: "CH123",
              createdAt: "2025-08-08T10:00:00Z",
              updatedAt: "2025-08-08T12:00:00Z",
              schemaVersion: "1",
              listing: {
                __typename: "ItemListing",
                id: "64f7a9c2d1e5b97f3c9d0a41",
                title: "City Bike",
                description: "Perfect for city commuting.",
                category: "Sports & Recreation",
                location: "Philadelphia, PA",
                images: ["/assets/item-images/bike.png"],
              },
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
              reserver: {
                __typename: "PersonalUser",
                id: "507f1f77bcf86cd799439099",
                account: {
                  __typename: "PersonalUserAccount",
                  username: "current_user",
                  profile: {
                    __typename: "PersonalUserAccountProfile",
                    firstName: "Current",
                    lastName: "User",
                  },
                },
              },
              messages: [
                {
                  __typename: "Message",
                  id: "64f7a9c2d1e5b97f3c9d0c09",
                  twilioMessageSid: "SM001",
                  authorId: "507f1f77bcf86cd799439099",
                  content: "Hi Alice! I'm interested in borrowing your bike.",
                  createdAt: "2025-08-08T10:05:00Z",
                },
                {
                  __typename: "Message",
                  id: "64f7a9c2d1e5b97f3c9d0c10",
                  twilioMessageSid: "SM002",
                  authorId: "507f1f77bcf86cd799439011",
                  content: "Hi! Yes, it's available.",
                  createdAt: "2025-08-08T10:15:00Z",
                },
              ],
            },
          },
        },
      },
    ],
  },
};
