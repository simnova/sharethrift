import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import {
	MockUnauthWrapper,
	withMockApolloClient,
	withMockRouter,
} from '@sthrift/ui-sharethrift-route-shared/test-utils';
import { AppContainer } from './app.container.tsx';
import { AppContainerCurrentUserDocument, ListingsPageContainerGetListingsDocument } from './generated.tsx';

const meta: Meta<typeof AppContainer> = {
	title: 'App/AppContainer',
	component: AppContainer,
	parameters: {
		a11y: { disable: true },
		layout: 'fullscreen',
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const AuthenticatedCompletedOnboarding: Story = {
	decorators: [withMockApolloClient, withMockRouter('/')],
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: AppContainerCurrentUserDocument,
						variables: {},
					},
					result: {
						data: {
							currentUserAndCreateIfNotExists: {
								__typename: 'PersonalUser' as const,
								id: 'user-123',
								userType: 'personal-user',
								hasCompletedOnboarding: true,
							},
						},
					},
				},
				{
					request: {
						query: ListingsPageContainerGetListingsDocument,
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
									state: "Active",
									images: ["/assets/item-images/bike.png"],
									createdAt: "2025-08-08T10:00:00Z",
									updatedAt: "2025-08-08T12:00:00Z",
									sharingPeriodStart: "2025-08-10T00:00:00Z",
									sharingPeriodEnd: "2025-08-17T00:00:00Z",
									schemaVersion: "1",
									version: 1,
									reports: 0,
									sharingHistory: [],
								},
							],
						},
					},
				},
			],
		},
	},
};

export const AuthenticatedNotCompletedOnboarding: Story = {
	decorators: [withMockApolloClient, withMockRouter('/')],
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: AppContainerCurrentUserDocument,
						variables: {},
					},
					result: {
						data: {
							currentUserAndCreateIfNotExists: {
								__typename: 'PersonalUser' as const,
								id: 'user-456',
								userType: 'personal-user',
								hasCompletedOnboarding: false,
							},
						},
					},
				},
				{
					request: {
						query: ListingsPageContainerGetListingsDocument,
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
									state: "Active",
									images: ["/assets/item-images/bike.png"],
									createdAt: "2025-08-08T10:00:00Z",
									updatedAt: "2025-08-08T12:00:00Z",
									sharingPeriodStart: "2025-08-10T00:00:00Z",
									sharingPeriodEnd: "2025-08-17T00:00:00Z",
									schemaVersion: "1",
									version: 1,
									reports: 0,
									sharingHistory: [],
								},
							],
						},
					},
				},
			],
		},
	},
};

export const Unauthenticated: Story = {
	decorators: [
		withMockApolloClient,
		(Story) => (
			<MockUnauthWrapper>
				<MemoryRouter initialEntries={['/']}>
					<Routes>
						<Route path="*" element={<Story />} />
					</Routes>
				</MemoryRouter>
			</MockUnauthWrapper>
		),
	],
	parameters: {
		apolloClient: {
			mocks: [],
		},
	},
};
