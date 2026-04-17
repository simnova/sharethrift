import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, waitFor } from 'storybook/test';
import { AdminListingOperationsPage } from './admin-listing-operations-page.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '@sthrift/ui-admin-route-shared/test-utils';
import { AdminListingsTableContainerAdminListingsDocument } from '../../../../generated.tsx';

const meta: Meta<typeof AdminListingOperationsPage> = {
	title: 'Pages/AdminListingOperationsPage',
	component: AdminListingOperationsPage,
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
type Story = StoryObj<typeof AdminListingOperationsPage>;

export const Default: Story = {
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.getByText('Test Listing')).toBeTruthy();
				expect(canvas.getByText('Listing Operations')).toBeTruthy();
			},
			{ timeout: 3000 },
		);
		const tabs = canvasElement.querySelectorAll('[role="tab"]');
		expect(tabs.length).toBe(0);
	},
};
