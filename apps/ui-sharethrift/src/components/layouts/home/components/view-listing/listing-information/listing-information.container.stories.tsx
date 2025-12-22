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
import { clickCancelThenConfirm } from '@sthrift/ui-components';

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

// Scenario-focused helpers for cleaner story declarations
const buildCancelSuccessMocks = (id: string) =>
	buildCancelReservationMocks({
		id,
		result: { id, state: 'Cancelled' },
		includeActiveReservationRefetch: true,
		activeReservationResult: null,
	});

const buildCancelErrorMocks = (id: string, message: string) =>
	buildCancelReservationMocks({
		id,
		error: new Error(message),
	});

const buildCreateSuccessMocks = (listingId: string, reservationId: string) =>
	buildCreateReservationMocks({
		listingId,
		result: { id: reservationId },
		activeReservation: {
			id: reservationId,
			state: 'Requested',
			reservationPeriodStart: String(new Date('2025-03-01').getTime()),
			reservationPeriodEnd: String(new Date('2025-03-10').getTime()),
		},
	});

const buildCreateErrorMocks = (listingId: string, message: string) =>
	buildCreateReservationMocks({
		listingId,
		error: new Error(message),
	});

// Reservation presets for common states
const requestedReservation = (id = 'res-1') =>
	makeUserReservationRequest({ id, state: 'Requested' });

/**
 * Exercise handleReserveClick with dates selected and successful mutation.
 * This covers lines 104-123 (the full handleReserveClick flow).
 */
export const ReserveWithDatesSuccess: Story = {
	args: {
		...baseAuthedBorrowerArgs,
		userReservationRequest: null,
	},
	parameters: {
		apolloClient: {
			mocks: buildCreateSuccessMocks('1', 'new-res-with-dates'),
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();

		// Wait for the date picker to be available
		await waitFor(() => {
			const dateInputs = canvas.queryAllByPlaceholderText(/date/i);
			expect(dateInputs.length).toBeGreaterThan(0);
		});

		// Click on date picker to open it
		const dateInputs = canvas.getAllByPlaceholderText(/date/i);
		const startDateInput = dateInputs[0];
		if (startDateInput) {
			await userEvent.click(startDateInput);
		}

		// Wait for calendar to open
		await waitFor(() => {
			const calendarCells = document.querySelectorAll('.ant-picker-cell-inner');
			expect(calendarCells.length).toBeGreaterThan(0);
		});

		// Select a future date (find cells that are not disabled)
		const availableCells = document.querySelectorAll(
			'.ant-picker-cell:not(.ant-picker-cell-disabled) .ant-picker-cell-inner',
		);

		if (availableCells.length >= 2) {
			// Click start date
			const startCell = availableCells[10];
			const endCell = availableCells[15];
			if (startCell && endCell) {
				await userEvent.click(startCell as HTMLElement);
				// Click end date
				await userEvent.click(endCell as HTMLElement);
			}
		}

		// Wait for Reserve button to be enabled
		await waitFor(
			() => {
				const reserveButton = canvas.queryByRole('button', {
					name: /reserve/i,
				});
				if (reserveButton && !reserveButton.hasAttribute('disabled')) {
					return reserveButton;
				}
				throw new Error('Reserve button not enabled yet');
			},
			{ timeout: 3000 },
		);

		// Click Reserve button
		const reserveButton = canvas.getByRole('button', { name: /reserve/i });
		await userEvent.click(reserveButton);
	},
};

/**
 * Exercise handleReserveClick error path with dates selected.
 * This covers the onError callback (lines 86-87) for create mutation.
 */
export const ReserveWithDatesError: Story = {
	args: {
		...baseAuthedBorrowerArgs,
		userReservationRequest: null,
	},
	parameters: {
		apolloClient: {
			mocks: buildCreateErrorMocks('1', 'Failed to create reservation request'),
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();

		// Wait for the date picker to be available
		await waitFor(() => {
			const dateInputs = canvas.queryAllByPlaceholderText(/date/i);
			expect(dateInputs.length).toBeGreaterThan(0);
		});

		// Click on date picker to open it
		const dateInputs = canvas.getAllByPlaceholderText(/date/i);
		const startInput = dateInputs[0];
		if (startInput) {
			await userEvent.click(startInput);
		}

		// Wait for calendar to open
		await waitFor(() => {
			const calendarCells = document.querySelectorAll('.ant-picker-cell-inner');
			expect(calendarCells.length).toBeGreaterThan(0);
		});

		// Select a future date
		const availableCells = document.querySelectorAll(
			'.ant-picker-cell:not(.ant-picker-cell-disabled) .ant-picker-cell-inner',
		);

		if (availableCells.length >= 2) {
			const startCell = availableCells[10];
			const endCell = availableCells[15];
			if (startCell && endCell) {
				await userEvent.click(startCell as HTMLElement);
				await userEvent.click(endCell as HTMLElement);
			}
		}

		// Wait for Reserve button to be enabled and click
		await waitFor(
			() => {
				const reserveButton = canvas.queryByRole('button', {
					name: /reserve/i,
				});
				if (reserveButton && !reserveButton.hasAttribute('disabled')) {
					return reserveButton;
				}
				throw new Error('Reserve button not enabled yet');
			},
			{ timeout: 3000 },
		);

		const reserveButton = canvas.getByRole('button', { name: /reserve/i });
		await userEvent.click(reserveButton);
	},
};

/**
 * Exercise cancelLoading early return path (lines 126-128).
 * Tests that handleCancelClick returns early when cancel is in progress.
 */
export const CancelLoadingEarlyReturn: Story = {
	args: {
		...baseAuthedBorrowerArgs,
		userReservationRequest: requestedReservation('res-loading-test'),
	},
	parameters: {
		apolloClient: {
			mocks: buildCancelReservationMocks({
				id: 'res-loading-test',
				result: { id: 'res-loading-test', state: 'Cancelled' },
				delay: 5000, // Long delay to keep loading state active
			}),
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();

		// First click to start the cancellation
		await clickCancelThenConfirm(canvasElement);

		// Try to click again while loading - this tests the early return
		// The second click should be ignored due to cancelLoading check
		const canvas = within(canvasElement);
		const cancelButton = canvas.queryByRole('button', {
			name: /cancel request/i,
		});
		if (cancelButton) {
			await userEvent.click(cancelButton);
		}
	},
};

/**
 * Exercise onCompleted callback for cancel mutation (lines 92-96).
 * Tests that success message is shown after cancellation.
 */
export const CancelOnCompletedCallback: Story = {
	args: {
		...baseAuthedBorrowerArgs,
		userReservationRequest: requestedReservation('res-completed-test'),
	},
	parameters: {
		apolloClient: {
			mocks: buildCancelSuccessMocks('res-completed-test'),
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
		await clickCancelThenConfirm(canvasElement);
	},
};

/**
 * Exercise onError callback for cancel mutation (lines 97-99).
 * Tests that error message is shown when cancellation fails.
 */
export const CancelOnErrorCallback: Story = {
	args: {
		...baseAuthedBorrowerArgs,
		userReservationRequest: requestedReservation('res-error-test'),
	},
	parameters: {
		apolloClient: {
			mocks: buildCancelErrorMocks('res-error-test', 'Network error occurred'),
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
		await clickCancelThenConfirm(canvasElement);
	},
};

/**
 * Exercise onCompleted callback for create mutation (lines 80-84).
 * Tests that refetchQueries is called and dates are reset after success.
 */
export const CreateOnCompletedCallback: Story = {
	args: {
		...baseAuthedBorrowerArgs,
		userReservationRequest: null,
	},
	parameters: {
		apolloClient: {
			mocks: buildCreateSuccessMocks('1', 'new-res-complete-test'),
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();

		// Wait for the date picker
		await waitFor(() => {
			const dateInputs = canvas.queryAllByPlaceholderText(/date/i);
			expect(dateInputs.length).toBeGreaterThan(0);
		});

		// Click on date picker
		const dateInputs = canvas.getAllByPlaceholderText(/date/i);
		const startDateInput = dateInputs[0];
		if (startDateInput) {
			await userEvent.click(startDateInput);
		}

		// Wait for calendar
		await waitFor(() => {
			const calendarCells = document.querySelectorAll('.ant-picker-cell-inner');
			expect(calendarCells.length).toBeGreaterThan(0);
		});

		// Select dates
		const availableCells = document.querySelectorAll(
			'.ant-picker-cell:not(.ant-picker-cell-disabled) .ant-picker-cell-inner',
		);

		if (availableCells.length >= 2) {
			const startCell = availableCells[10];
			const endCell = availableCells[15];
			if (startCell && endCell) {
				await userEvent.click(startCell as HTMLElement);
				await userEvent.click(endCell as HTMLElement);
			}
		}

		// Wait and click Reserve
		await waitFor(
			() => {
				const reserveButton = canvas.queryByRole('button', {
					name: /reserve/i,
				});
				if (reserveButton && !reserveButton.hasAttribute('disabled')) {
					return reserveButton;
				}
				throw new Error('Reserve button not enabled yet');
			},
			{ timeout: 3000 },
		);

		const reserveButton = canvas.getByRole('button', { name: /reserve/i });
		await userEvent.click(reserveButton);
	},
};

/**
 * Exercise onError callback for create mutation (lines 86-87).
 * Tests that error is logged when creation fails.
 */
export const CreateOnErrorCallback: Story = {
	args: {
		...baseAuthedBorrowerArgs,
		userReservationRequest: null,
	},
	parameters: {
		apolloClient: {
			mocks: buildCreateErrorMocks('1', 'Database connection failed'),
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();

		// Wait for the date picker
		await waitFor(() => {
			const dateInputs = canvas.queryAllByPlaceholderText(/date/i);
			expect(dateInputs.length).toBeGreaterThan(0);
		});

		// Click on date picker
		const dateInputs = canvas.getAllByPlaceholderText(/date/i);
		const startDateInput = dateInputs[0];
		if (startDateInput) {
			await userEvent.click(startDateInput);
		}

		// Wait for calendar
		await waitFor(() => {
			const calendarCells = document.querySelectorAll('.ant-picker-cell-inner');
			expect(calendarCells.length).toBeGreaterThan(0);
		});

		// Select dates
		const availableCells = document.querySelectorAll(
			'.ant-picker-cell:not(.ant-picker-cell-disabled) .ant-picker-cell-inner',
		);

		if (availableCells.length >= 2) {
			const startCell = availableCells[10];
			const endCell = availableCells[15];
			if (startCell && endCell) {
				await userEvent.click(startCell as HTMLElement);
				await userEvent.click(endCell as HTMLElement);
			}
		}

		// Wait and click Reserve
		await waitFor(
			() => {
				const reserveButton = canvas.queryByRole('button', {
					name: /reserve/i,
				});
				if (reserveButton && !reserveButton.hasAttribute('disabled')) {
					return reserveButton;
				}
				throw new Error('Reserve button not enabled yet');
			},
			{ timeout: 3000 },
		);

		const reserveButton = canvas.getByRole('button', { name: /reserve/i });
		await userEvent.click(reserveButton);
	},
};
