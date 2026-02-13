import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { AppRoutes } from '../../..';
import { HomeCreateListingContainerCreateItemListingDocument } from '../../../../../../generated';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../../../test-utils/storybook-decorators';
import { userIsAdminMockRequest } from '../../../../../../test-utils/storybook-helpers';

const meta: Meta<typeof AppRoutes> = {
	title: 'Pages/Create Listing',
	component: AppRoutes,
	parameters: {
		layout: 'fullscreen',
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeCreateListingContainerCreateItemListingDocument,
						variables: {
							input: expect.any(Object),
						},
					},
					result: {
						data: {
							createItemListing: {
								__typename: 'ItemListing',
								id: '1',
								title: 'Test Listing',
								state: 'Active',
							},
						},
					},
				},
			],
		},
	},
	decorators: [withMockApolloClient, withMockRouter('/create-listing')],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		apolloClient: {
			mocks: [userIsAdminMockRequest('user-1', true)],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};
