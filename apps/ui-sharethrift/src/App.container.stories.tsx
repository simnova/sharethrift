import type { Meta, StoryObj } from '@storybook/react';
import { AppContainer } from './App.container.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from './test-utils/storybook-decorators.tsx';
import {
	AppContainerCurrentUserDocument,
	ListingsPageContainerGetListingsDocument,
	SelectAccountTypeContainerAccountPlansDocument,
	SelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument,
} from './generated.tsx';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { MockUnauthWrapper } from './test-utils/storybook-mock-auth-wrappers.tsx';
import { userIsAdminMockRequest } from './test-utils/storybook-helpers.ts';

const mockListings = [
	{
		__typename: 'ItemListing',
		id: '1',
		title: 'Projector',
		description: 'High-quality projector for home and office use',
		category: 'Tools & Equipment',
		location: 'Toronto, ON',
		state: 'Active',
		images: ['/assets/item-images/projector.png'],
		sharingPeriodStart: '2025-01-01',
		sharingPeriodEnd: '2025-12-31',
		createdAt: '2025-01-01T00:00:00Z',
		updatedAt: '2025-01-01T00:00:00Z',
		schemaVersion: '1.0',
		version: '1.0',
		reports: 0,
		sharingHistory: [],
	},
	{
		__typename: 'ItemListing',
		id: '2',
		title: 'Umbrella',
		description: 'Umbrella in excellent condition',
		category: 'Accessories',
		location: 'Vancouver, BC',
		state: 'Active',
		images: ['/assets/item-images/umbrella.png'],
		sharingPeriodStart: '2025-02-01',
		sharingPeriodEnd: '2025-06-30',
		createdAt: '2025-01-15T00:00:00Z',
		updatedAt: '2025-01-15T00:00:00Z',
		schemaVersion: '1.0',
		version: '1.0',
		reports: 0,
		sharingHistory: [],
	},
];

const buildListingsMock = (listings = mockListings) => ({
	request: { query: ListingsPageContainerGetListingsDocument },
	result: { data: { itemListings: listings } },
});

const meta: Meta<typeof AppContainer> = {
	title: 'App/AppContainer',
	component: AppContainer,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['!dev'], // functional testing story, not rendered in sidebar - https://storybook.js.org/docs/writing-stories/tags
};

export default meta;
type Story = StoryObj<typeof meta>;

// Helper to build a current-user mock
const buildCurrentUserMock = (
	opts: { id?: string; hasCompletedOnboarding?: boolean } = {},
) => ({
	request: {
		query: AppContainerCurrentUserDocument,
		variables: {},
	},
	result: {
		data: {
			currentUserAndCreateIfNotExists: {
				__typename: 'PersonalUser' as const,
				id: opts.id ?? 'user-123',
				userType: 'personal-user',
				hasCompletedOnboarding: opts.hasCompletedOnboarding ?? true,
			},
		},
	},
});

// Reusable canned responses
const mockAuthenticatedCompletedOnboarding = buildCurrentUserMock({
	id: 'user-123',
	hasCompletedOnboarding: true,
});
const mockAuthenticatedNotCompletedOnboarding = buildCurrentUserMock({
	id: 'user-456',
	hasCompletedOnboarding: false,
});

export const AuthenticatedCompletedOnboarding: Story = {
	decorators: [withMockApolloClient, withMockRouter('/')],
	parameters: {
		apolloClient: {
			mocks: [
				mockAuthenticatedCompletedOnboarding,
				buildListingsMock(),
				userIsAdminMockRequest('user-123', false),
			],
		},
	},
};

export const AuthenticatedNotCompletedOnboarding: Story = {
	decorators: [withMockApolloClient, withMockRouter('/')],
	parameters: {
		apolloClient: {
			mocks: [
				mockAuthenticatedNotCompletedOnboarding,
				{
					request: {
						query:
							SelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument,
					},
					result: {
						data: {
							currentPersonalUserAndCreateIfNotExists: {
								id: 'user-456',
								account: {
									accountType: 'personal-user',
								},
							},
						},
					},
				},
				buildListingsMock(),
				userIsAdminMockRequest('user-456', false),
				{
					request: { query: SelectAccountTypeContainerAccountPlansDocument },
					result: {
						data: {
							accountPlans: [
								{
									name: 'non-verified-personal',
									description: 'Non-Verified Personal',
									billingPeriodLength: 0,
									billingPeriodUnit: 'month',
									billingAmount: 0,
									currency: 'USD',
									setupFee: 0,
									feature: {
										activeReservations: 0,
										bookmarks: 3,
										itemsToShare: 15,
										friends: 5,
										__typename: 'AccountPlanFeature',
									},
									status: null,
									cybersourcePlanId: null,
									id: '607f1f77bcf86cd799439001',
									schemaVersion: '1.0.0',
									createdAt: '2023-05-02T10:00:00.000Z',
									updatedAt: '2023-05-02T10:00:00.000Z',
									__typename: 'AccountPlan',
								},
								{
									name: 'verified-personal',
									description: 'Verified Personal',
									billingPeriodLength: 0,
									billingPeriodUnit: 'month',
									billingAmount: 0,
									currency: 'USD',
									setupFee: 0,
									feature: {
										activeReservations: 10,
										bookmarks: 10,
										itemsToShare: 30,
										friends: 10,
										__typename: 'AccountPlanFeature',
									},
									status: null,
									cybersourcePlanId: null,
									id: '607f1f77bcf86cd799439002',
									schemaVersion: '1.0.0',
									createdAt: '2023-05-02T10:00:00.000Z',
									updatedAt: '2023-05-02T10:00:00.000Z',
									__typename: 'AccountPlan',
								},
								{
									name: 'verified-personal-plus',
									description: 'Verified Personal Plus',
									billingPeriodLength: 12,
									billingPeriodUnit: 'month',
									billingAmount: 4.99,
									currency: 'USD',
									setupFee: 0,
									feature: {
										activeReservations: 30,
										bookmarks: 30,
										itemsToShare: 50,
										friends: 30,
										__typename: 'AccountPlanFeature',
									},
									status: 'active',
									cybersourcePlanId: 'cybersource_plan_001',
									id: '607f1f77bcf86cd799439000',
									schemaVersion: '1.0.0',
									createdAt: '2023-05-02T10:00:00.000Z',
									updatedAt: '2023-05-02T10:00:00.000Z',
									__typename: 'AccountPlan',
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
			mocks: [buildListingsMock(), userIsAdminMockRequest('user-456', false)],
		},
	},
};
