import type { Meta, StoryFn } from "@storybook/react";
import { HomeRoutes } from "../../../index.tsx";
import { HomeAccountSettingsViewContainerCurrentUserDocument } from "../../../../../../generated.tsx";
import { withMockApolloClient, withMockRouter } from "../../../../../../test-utils/storybook-decorators.tsx";
import { expect, within } from 'storybook/test';

const meta: Meta<typeof HomeRoutes> = {
	title: "Pages/Account/Settings",
	component: HomeRoutes,
	decorators: [
		withMockApolloClient,
		withMockRouter("/account/settings"),
	],
};

export default meta;

const Template: StoryFn<typeof HomeRoutes> = () => <HomeRoutes />;

export const DefaultView: StoryFn<typeof HomeRoutes> = Template.bind({});

DefaultView.play = async ({ canvasElement }) => {
	const canvas = within(canvasElement);
	await expect(canvas.getByRole('main')).toBeInTheDocument();
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