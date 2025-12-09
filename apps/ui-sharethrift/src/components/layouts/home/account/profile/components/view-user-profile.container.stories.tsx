import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";
import {
  withMockApolloClient,
  withMockRouter,
} from "../../../../../../test-utils/storybook-decorators.tsx";
import {
  HomeAccountViewUserProfileCurrentUserDocument,
  HomeAccountViewUserProfileUserByIdDocument,
} from "../../../../../../generated.tsx";
import { ViewUserProfileContainer } from "./view-user-profile.container.tsx";

const mockCurrentUser = {
  __typename: "AdminUser",
  id: "807f1f77bcf86cd799439044",
  userIsAdmin: true,
  role: {
    permissions: {
      userPermissions: {
        canViewAllUsers: true,
        canBlockUsers: true,
        __typename: "AdminRoleUserPermissions",
      },
      __typename: "AdminRolePermissions",
    },
    __typename: "AdminRole",
  },
};

const mockProfileUser = {
  id: "507f1f77bcf86cd799439011",
  userType: "personal-users",
  isBlocked: false,
  createdAt: "2023-01-01T10:00:00.000Z",
  account: {
    accountType: "verified-personal",
    email: "alice@example.com",
    username: "alice",
    profile: {
      firstName: "Alice",
      lastName: "Smith",
      location: {
        city: "Springfield",
        state: "IL",
        __typename: "PersonalUserAccountProfileLocation",
      },
      __typename: "PersonalUserAccountProfile",
    },
    __typename: "PersonalUserAccount",
  },
  __typename: "PersonalUser",
};

const meta: Meta = {
  title: "Layouts/Home/Account/Profile/ViewUserProfileContainer",
  component: ViewUserProfileContainer,
  parameters: {
    layout: "fullscreen",
    apolloClient: {
      mocks: [
        {
          request: {
            query: HomeAccountViewUserProfileCurrentUserDocument,
          },
          result: {
            data: {
              currentUser: mockCurrentUser,
            },
          },
        },
        {
          request: {
            query: HomeAccountViewUserProfileUserByIdDocument,
            variables: { userId: "507f1f77bcf86cd799439011" },
          },
          result: {
            data: {
              userById: mockProfileUser,
            },
          },
        },
      ],
    },
  },
  decorators: [
    withMockApolloClient,
    withMockRouter(
      "/account/profile/507f1f77bcf86cd799439011",
      "/account/profile/:userId"
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy();
  },
};

export const Empty: Story = {
  parameters: {
    apolloClient: {
      mocks: [
        {
          request: {
            query: HomeAccountViewUserProfileCurrentUserDocument,
          },
          result: {
            data: {
              currentUser: mockCurrentUser,
            },
          },
        },
        {
          request: {
            query: HomeAccountViewUserProfileUserByIdDocument,
            variables: { userId: "507f1f77bcf86cd799439011" },
          },
          result: {
            data: {
              userById: null,
            },
          },
        },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy();
  },
};

export const Loading: Story = {
  parameters: {
    apolloClient: {
      mocks: [
        {
          request: {
            query: HomeAccountViewUserProfileCurrentUserDocument,
          },
          result: {
            data: {
              currentUser: mockCurrentUser,
            },
          },
          delay: 1000,
        },
        {
          request: {
            query: HomeAccountViewUserProfileUserByIdDocument,
            variables: { userId: "507f1f77bcf86cd799439011" },
          },
          result: {
            data: {
              userById: mockProfileUser,
            },
          },
          delay: 1000,
        },
      ],
    },
  },
};
