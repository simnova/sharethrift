import type { Meta, StoryObj } from '@storybook/react';

import { expect, within } from 'storybook/test';
import { AppRoutes } from '../../../../..';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../../../../../test-utils/storybook-decorators.tsx';
import { HomeAccountSettingsViewContainerCurrentUserDocument } from '../../../../../../../../generated.tsx';
import { userIsAdminMockRequest } from '../../../../../../../../test-utils/storybook-helpers.ts';

const meta: Meta<typeof AppRoutes> = {
	title: 'Pages/Account/Settings',
	component: AppRoutes,
	decorators: [withMockApolloClient, withMockRouter('/account/settings')],
};

export default meta;

type Story = StoryObj<typeof meta>;
export const DefaultView: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeAccountSettingsViewContainerCurrentUserDocument,
					},
					delay: 100,
					result: {
						data: {
							currentUser: {
								__typename: 'PersonalUser',
								id: '507f1f77bcf86cd799439099',
								userType: 'personal-user',
								createdAt: '2024-08-01T00:00:00Z',
								updatedAt: '2025-08-08T12:00:00Z',
								account: {
									__typename: 'PersonalUserAccount',
									accountType: 'personal',
									email: 'patrick.g@example.com',
									username: 'patrick_g',
									profile: {
										__typename: 'PersonalUserAccountProfile',

										firstName: 'Patrick',
										lastName: 'Garcia',
										aboutMe:
											'Enthusiastic thrift shopper and vintage lover. Always on the hunt for unique finds and sustainable fashion.',
										location: {
											__typename: 'PersonalUserAccountProfileLocation',
											address1: '123 Main Street',
											address2: 'Apt 4B',
											city: 'Philadelphia',
											state: 'PA',
											country: 'United States',
											zipCode: '19101',
										},
										billing: {
											__typename: 'PersonalUserAccountProfileBilling',
											subscription: {
												__typename:
													'PersonalUserAccountProfileBillingSubscription',
												subscriptionId: 'sub_123456789',
											},
											cybersourceCustomerId: 'cust_abc123',
										},
									},
								},
							},
						},
					},
				},
				userIsAdminMockRequest('507f1f77bcf86cd799439099'),
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('main')).toBeInTheDocument();
	},
};
