import type { Meta, StoryObj } from '@storybook/react';
import { AppContainer } from './app.container.tsx';
import {
	withMockApolloClient,
	withMockRouter,
	MockUnauthWrapper,
} from './test-utils/storybook-decorators.tsx';
import { AppContainerCurrentUserDocument, ListingsPageContainerGetListingsDocument, UseUserIsAdminDocument } from './generated.tsx';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const meta: Meta<typeof AppContainer> = {
	title: 'App/AppContainer',
	component: AppContainer,
	parameters: {
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
				{
					request: {
						query: UseUserIsAdminDocument,
					},
					result: {
						data: {
							currentUser: {
								__typename: "PersonalUser",
								id: "user-123",
								userIsAdmin: false,
							},
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
				{
					request: {
						query: UseUserIsAdminDocument,
					},
					result: {
						data: {
							currentUser: {
								__typename: "PersonalUser",
								id: "user-456",
								userIsAdmin: false,
							},
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
