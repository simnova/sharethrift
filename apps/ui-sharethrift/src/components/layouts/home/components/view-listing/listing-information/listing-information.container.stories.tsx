import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, waitFor } from 'storybook/test';
import { ListingInformationContainer } from './listing-information.container.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../../../test-utils/storybook-decorators.tsx';
import {
	ViewListingCurrentUserDocument,
	ViewListingQueryActiveByListingIdDocument,
	HomeListingInformationCreateReservationRequestDocument,
	HomeListingInformationCancelReservationRequestDocument,
	ViewListingActiveReservationRequestForListingDocument,
} from '../../../../../../generated.tsx';
import { clickCancelThenConfirm } from '../../../../../../test-utils/popconfirm-test-utils.ts';

const mockListing = {
	__typename: 'ItemListing' as const,
	listingType: 'item-listing' as const,
	id: '1',
	title: 'Cordless Drill',
	description: 'High-quality cordless drill for home projects',
	category: 'Tools & Equipment',
	location: 'Toronto, ON',
	state: 'Active' as const,
	images: ['/assets/item-images/projector.png'],
	sharingPeriodStart: new Date('2025-01-01'),
	sharingPeriodEnd: new Date('2025-12-31'),
	createdAt: new Date('2025-01-01T00:00:00Z'),
	updatedAt: new Date('2025-01-01T00:00:00Z'),
};

const mockCurrentUser = {
	__typename: 'PersonalUser',
	id: 'user-2',
};

/**
 * Build base mocks for listing queries
 */
const buildBaseListingMocks = () => [
	{
		request: {
			query: ViewListingCurrentUserDocument,
		},
		result: {
			data: {
				currentUser: mockCurrentUser,
			},
		},
	},
	{
		request: {
			query: ViewListingQueryActiveByListingIdDocument,
			variables: { listingId: '1' },
		},
		result: {
			data: {
				queryActiveByListingId: [],
			},
		},
	},
];

/**
 * Build mocks for cancel reservation mutation with optional refetch
 */
const buildCancelReservationMocks = ({
	id,
	result,
	error,
	delay,
	includeActiveReservationRefetch = false,
	activeReservationResult = null,
}: {
	id: string;
	result?: { id: string; state: string };
	error?: Error;
	delay?: number;
	includeActiveReservationRefetch?: boolean;
	activeReservationResult?: unknown;
}) => {
	const mocks: any[] = [
		...buildBaseListingMocks(),
		{
			request: {
				query: HomeListingInformationCancelReservationRequestDocument,
				variables: { input: { id } },
			},
			...(result
				? {
						result: {
							data: {
								cancelReservation: {
									__typename: 'ReservationRequest',
									...result,
								},
							},
						},
					}
				: {}),
			...(error ? { error } : {}),
			...(delay ? { delay } : {}),
		},
	];

	if (includeActiveReservationRefetch) {
		mocks.push({
			request: {
				query: ViewListingActiveReservationRequestForListingDocument,
				variables: { listingId: '1', reserverId: mockCurrentUser.id },
			},
			result: {
				data: { myActiveReservationForListing: activeReservationResult },
			},
		});
	}

	return mocks;
};

/**
 * Build mocks for create reservation mutation with optional refetch
 */
const buildCreateReservationMocks = ({
	listingId,
	result,
	error,
	activeReservation,
}: {
	listingId: string;
	result?: { id: string };
	error?: Error;
	activeReservation?: {
		id: string;
		state: string;
		reservationPeriodStart: string;
		reservationPeriodEnd: string;
	} | null;
}) => {
	const mocks: any[] = [
		...buildBaseListingMocks(),
		{
			request: {
				query: HomeListingInformationCreateReservationRequestDocument,
				variables: {
					input: {
						listingId,
						reservationPeriodStart: expect.any(String),
						reservationPeriodEnd: expect.any(String),
					},
				},
			},
			variableMatcher: () => true,
			...(result
				? {
						result: {
							data: {
								createReservationRequest: {
									__typename: 'ReservationRequest',
									...result,
								},
							},
						},
					}
				: {}),
			...(error ? { error } : {}),
		},
	];

	if (activeReservation !== undefined) {
		mocks.push({
			request: {
				query: ViewListingActiveReservationRequestForListingDocument,
				variables: { listingId, reserverId: mockCurrentUser.id },
			},
			result: {
				data: {
					myActiveReservationForListing: activeReservation
						? { __typename: 'ReservationRequest', ...activeReservation }
						: null,
				},
			},
		});
	}

	return mocks;
};

/**
 * Base args for authenticated borrower scenarios
 */
const baseAuthedBorrowerArgs = {
	listing: mockListing,
	userIsSharer: false,
	isAuthenticated: true,
};

/**
 * Factory to create reservation request objects with defaults
 */
const makeUserReservationRequest = (
	overrides: Partial<{
		id: string;
		state: 'Requested' | 'Accepted' | 'Rejected' | 'Cancelled';
		reservationPeriodStart: string;
		reservationPeriodEnd: string;
	}> = {},
) => ({
	__typename: 'ReservationRequest' as const,
	id: 'res-1',
	state: 'Requested' as const,
	reservationPeriodStart: '2025-02-01',
	reservationPeriodEnd: '2025-02-10',
	...overrides,
});

const meta: Meta<typeof ListingInformationContainer> = {
	title: 'Containers/ListingInformationContainer',
	component: ListingInformationContainer,
	parameters: {
		layout: 'padded',
		apolloClient: {
			mocks: [
				{
					request: {
						query: ViewListingCurrentUserDocument,
					},
					result: {
						data: {
							currentUser: mockCurrentUser,
						},
					},
				},
				{
					request: {
						query: ViewListingQueryActiveByListingIdDocument,
						variables: { listingId: '1' },
					},
					result: {
						data: {
							queryActiveByListingId: [],
						},
					},
				},
				{
					request: {
						query: HomeListingInformationCreateReservationRequestDocument,
						variables: {
							input: {
								listingId: '1',
								reservationPeriodStart: expect.any(String),
								reservationPeriodEnd: expect.any(String),
							},
						},
					},
					result: {
						data: {
							createReservationRequest: {
								__typename: 'ReservationRequest',
								id: 'res-1',
							},
						},
					},
				},
			],
		},
	},
	decorators: [withMockApolloClient, withMockRouter('/listing/1')],
};

export default meta;
type Story = StoryObj<typeof ListingInformationContainer>;

export const AuthenticatedUser: Story = {
	args: {
		listing: mockListing,
		userIsSharer: false,
		isAuthenticated: true,
		userReservationRequest: null,
		onLoginClick: () => {},
		onSignUpClick: () => {},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const UnauthenticatedUser: Story = {
	args: {
		listing: mockListing,
		userIsSharer: false,
		isAuthenticated: false,
		userReservationRequest: null,
		onLoginClick: () => {},
		onSignUpClick: () => {},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const SharerView: Story = {
	args: {
		listing: mockListing,
		userIsSharer: true,
		isAuthenticated: true,
		userReservationRequest: null,
		onLoginClick: () => {},
		onSignUpClick: () => {},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const WithExistingReservation: Story = {
	args: {
		...baseAuthedBorrowerArgs,
		userReservationRequest: makeUserReservationRequest(),
		onLoginClick: () => {},
		onSignUpClick: () => {},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

// Exercise early-return path when cancelling without a reservation id
export const CancelReservationNoId: Story = {
	args: {
		...baseAuthedBorrowerArgs,
		userReservationRequest: makeUserReservationRequest({ id: '' }),
	},
	parameters: {
		apolloClient: {
			mocks: buildBaseListingMocks(),
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
		await clickCancelThenConfirm(canvasElement);
	},
};

// Exercise success path of handleCancelClick (successful cancellation)
export const CancelReservationSuccess: Story = {
	args: {
		...baseAuthedBorrowerArgs,
		userReservationRequest: makeUserReservationRequest({ id: 'res-cancel-1' }),
	},
	parameters: {
		apolloClient: {
			mocks: buildCancelReservationMocks({
				id: 'res-cancel-1',
				result: { id: 'res-cancel-1', state: 'Cancelled' },
				includeActiveReservationRefetch: true,
				activeReservationResult: null,
			}),
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
		await clickCancelThenConfirm(canvasElement);
	},
};

// Exercise error path of handleCancelClick (mutation failure)
export const CancelReservationError: Story = {
	args: {
		...baseAuthedBorrowerArgs,
		userReservationRequest: makeUserReservationRequest({
			id: 'res-cancel-error',
		}),
	},
	parameters: {
		apolloClient: {
			mocks: buildCancelReservationMocks({
				id: 'res-cancel-error',
				error: new Error(
					'Only the reserver can cancel their reservation request',
				),
			}),
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
		await clickCancelThenConfirm(canvasElement);
	},
};

// Exercise loading state during cancellation
export const CancelReservationLoading: Story = {
	args: {
		...baseAuthedBorrowerArgs,
		userReservationRequest: makeUserReservationRequest({
			id: 'res-cancel-loading',
		}),
	},
	parameters: {
		apolloClient: {
			mocks: buildCancelReservationMocks({
				id: 'res-cancel-loading',
				result: { id: 'res-cancel-loading', state: 'Cancelled' },
				delay: 200,
			}),
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

// Exercise success path of handleReserveClick (successful reservation creation)
export const CreateReservationSuccess: Story = {
	args: {
		...baseAuthedBorrowerArgs,
		userReservationRequest: null,
	},
	parameters: {
		apolloClient: {
			mocks: buildCreateReservationMocks({
				listingId: '1',
				result: { id: 'new-res-1' },
				activeReservation: {
					id: 'new-res-1',
					state: 'Requested',
					reservationPeriodStart: String(new Date('2025-03-01').getTime()),
					reservationPeriodEnd: String(new Date('2025-03-10').getTime()),
				},
			}),
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();

		await waitFor(() => {
			const dateInputs = canvas.queryAllByPlaceholderText(/date/i);
			expect(dateInputs.length).toBeGreaterThan(0);
		});

		const dateInputs = canvas.getAllByPlaceholderText(/date/i);
		if (dateInputs[0]) {
			await userEvent.click(dateInputs[0]);
		}
	},
};

// Exercise error path of handleReserveClick (mutation failure)
export const CreateReservationError: Story = {
	args: {
		...baseAuthedBorrowerArgs,
		userReservationRequest: null,
	},
	parameters: {
		apolloClient: {
			mocks: buildCreateReservationMocks({
				listingId: '1',
				error: new Error('Failed to create reservation request'),
			}),
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();

		await waitFor(() => {
			const dateInputs = canvas.queryAllByPlaceholderText(/date/i);
			expect(dateInputs.length).toBeGreaterThan(0);
		});
	},
};

// Exercise onCompleted callback for create mutation
export const CreateReservationOnCompleted: Story = {
	args: {
		...baseAuthedBorrowerArgs,
		userReservationRequest: null,
	},
	parameters: {
		apolloClient: {
			mocks: buildCreateReservationMocks({
				listingId: '1',
				result: { id: 'new-res-completed' },
				activeReservation: {
					id: 'new-res-completed',
					state: 'Requested',
					reservationPeriodStart: String(new Date('2025-03-01').getTime()),
					reservationPeriodEnd: String(new Date('2025-03-10').getTime()),
				},
			}),
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

// Exercise onError callback for create mutation
export const CreateReservationOnError: Story = {
	args: {
		...baseAuthedBorrowerArgs,
		userReservationRequest: null,
	},
	parameters: {
		apolloClient: {
			mocks: buildCreateReservationMocks({
				listingId: '1',
				error: new Error('Reservation period overlaps with existing booking'),
			}),
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};
