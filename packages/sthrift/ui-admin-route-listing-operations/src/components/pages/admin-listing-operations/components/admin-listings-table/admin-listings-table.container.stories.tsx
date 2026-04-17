import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, waitFor } from 'storybook/test';
import { AdminListings } from './admin-listings-table.container.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '@sthrift/ui-admin-route-shared/test-utils';
import { AdminListingsTableContainerAdminListingsDocument } from '../../../../../generated.tsx';

const meta: Meta<typeof AdminListings> = {
	title: 'Components/AdminListingsTable/Container',
	component: AdminListings,
	parameters: {
		a11y: { disable: true },
		layout: 'fullscreen',
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminListingsTableContainerAdminListingsDocument,
					},
					variableMatcher: () => true,
					result: {
						data: {
							adminListings: {
								items: [
									{
										id: 'listing-1',
										title: 'Test Listing',
										images: ['https://example.com/image.jpg'],
										createdAt: '2024-01-01T00:00:00Z',
										sharingPeriodStart: '2024-01-15',
										sharingPeriodEnd: '2024-02-15',
										state: 'Blocked',
									},
								],
								total: 1,
							},
						},
					},
				},
			],
		},
	},
	decorators: [
		withMockApolloClient,
		withMockRouter('/account/admin-listing-operations'),
	],
};

export default meta;
type Story = StoryObj<typeof AdminListings>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvasElement).toBeTruthy();
			},
			{ timeout: 3000 },
		);
		expect(canvas.getByText('Test Listing')).toBeTruthy();
	},
};
