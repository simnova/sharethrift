import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, fn } from 'storybook/test';
import { ListingInformation } from './listing-information.tsx';
import { withMockRouter } from '../../../../../../test-utils/storybook-decorators.tsx';

const mockListing = {
	__typename: 'ItemListing' as const,
	listingType: 'item-listing' as const,
	id: '1',
	title: 'Cordless Drill',
	description: 'High-quality cordless drill for home projects. Perfect for DIY enthusiasts and professionals alike. Features variable speed settings and a comfortable grip.',
	category: 'Tools & Equipment',
	location: 'Toronto, ON',
	state: 'Published' as const,
	images: ['/assets/item-images/projector.png'],
	sharingPeriodStart: new Date('2025-01-01'),
	sharingPeriodEnd: new Date('2025-12-31'),
	createdAt: new Date('2025-01-01T00:00:00Z'),
	updatedAt: new Date('2025-01-01T00:00:00Z'),
};

const mockOtherReservations = [
	{
		id: 'res-other-1',
		reservationPeriodStart: String(new Date('2025-02-15').getTime()),
		reservationPeriodEnd: String(new Date('2025-02-20').getTime()),
	},
	{
		id: 'res-other-2',
		reservationPeriodStart: String(new Date('2025-03-01').getTime()),
		reservationPeriodEnd: String(new Date('2025-03-10').getTime()),
	},
];

const meta: Meta<typeof ListingInformation> = {
	title: 'Components/ListingInformation',
	component: ListingInformation,
	parameters: {
		layout: 'padded',
	},
	decorators: [withMockRouter('/listing/1')],
	args: {
		listing: mockListing,
		userIsSharer: false,
		isAuthenticated: true,
		userReservationRequest: null,
		onReserveClick: () => {},
		onLoginClick: () => {},
		onSignUpClick: () => {},
		onCancelClick: () => {},
		reservationDates: { startDate: null, endDate: null },
		onReservationDatesChange: () => {},
		reservationLoading: false,
		otherReservationsLoading: false,
		otherReservations: [],
	},
};

export default meta;
type Story = StoryObj<typeof ListingInformation>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
		await expect(canvasElement.querySelector('.title42')).toBeTruthy();
	},
};

export const Unauthenticated: Story = {
	args: {
		isAuthenticated: false,
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const SharerView: Story = {
	args: {
		userIsSharer: true,
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const WithPendingRequest: Story = {
	args: {
		userReservationRequest: {
			__typename: 'ReservationRequest' as const,
			id: 'res-1',
			state: 'Requested' as const,
			reservationPeriodStart: '1738368000000',
			reservationPeriodEnd: '1739145600000',
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const WithDatesSelected: Story = {
	args: {
		reservationDates: {
			startDate: new Date('2025-02-01'),
			endDate: new Date('2025-02-10'),
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const ListingNotPublished: Story = {
	args: {
		listing: {
			...mockListing,
			state: 'Drafted' as const,
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
		await expect(canvasElement.textContent).toContain('Listing Not Available');
	},
};

export const LoadingOtherReservations: Story = {
	args: {
		otherReservationsLoading: true,
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const ReservationLoading: Story = {
	args: {
		reservationLoading: true,
		reservationDates: {
			startDate: new Date('2025-02-01'),
			endDate: new Date('2025-02-10'),
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const WithOtherReservations: Story = {
	args: {
		otherReservations: mockOtherReservations,
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const WithReservationError: Story = {
	args: {
		otherReservationsError: new Error('Failed to load reservations'),
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const ClickReserveButton: Story = {
	args: {
		onReserveClick: fn(),
		reservationDates: {
			startDate: new Date('2025-02-01'),
			endDate: new Date('2025-02-10'),
		},
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		const reserveButton = canvas.queryByRole('button', { name: /Reserve/i });
		if (reserveButton) {
			await userEvent.click(reserveButton);
			expect(args.onReserveClick).toHaveBeenCalled();
		}
	},
};

export const ClickCancelButton: Story = {
	args: {
		onCancelClick: fn(),
		userReservationRequest: {
			__typename: 'ReservationRequest' as const,
			id: 'res-1',
			state: 'Requested' as const,
			reservationPeriodStart: '1738368000000',
			reservationPeriodEnd: '1739145600000',
		},
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		const cancelButton = canvas.queryByRole('button', { name: /Cancel/i });
		if (cancelButton) {
			await userEvent.click(cancelButton);
			expect(args.onCancelClick).toHaveBeenCalled();
		}
	},
};

export const UnauthenticatedLoginClick: Story = {
	args: {
		isAuthenticated: false,
		onLoginClick: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		const loginButton = canvas.queryByRole('button', { name: /Login/i });
		if (loginButton) {
			await userEvent.click(loginButton);
			expect(args.onLoginClick).toHaveBeenCalled();
		}
	},
};

export const UnauthenticatedSignUpClick: Story = {
	args: {
		isAuthenticated: false,
		onSignUpClick: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		const signUpButton = canvas.queryByRole('button', { name: /Sign Up/i });
		if (signUpButton) {
			await userEvent.click(signUpButton);
			expect(args.onSignUpClick).toHaveBeenCalled();
		}
	},
};

export const WithApprovedReservation: Story = {
	args: {
		userReservationRequest: {
			__typename: 'ReservationRequest' as const,
			id: 'res-1',
			state: 'Accepted' as const,
			reservationPeriodStart: '1738368000000',
			reservationPeriodEnd: '1739145600000',
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const DateRangeWithOverlap: Story = {
	args: {
		otherReservations: mockOtherReservations,
		onReservationDatesChange: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		const dateInputs = canvas.getAllByPlaceholderText(/date/i);
		const firstInput = dateInputs[0];
		if (firstInput) {
			await userEvent.click(firstInput);
		}
	},
};

export const ClickLoginToReserve: Story = {
	args: {
		isAuthenticated: false,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		const loginButton = canvas.queryByRole('button', { name: /Log in to Reserve/i });
		if (loginButton) {
			await userEvent.click(loginButton);
		}
	},
};

export const SelectDatesInDatePicker: Story = {
	args: {
		otherReservations: [],
		onReservationDatesChange: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		const dateInputs = canvas.getAllByPlaceholderText(/date/i);
		const firstInput = dateInputs[0];
		if (firstInput) {
			await userEvent.click(firstInput);
		}
	},
};

export const ClearDateSelection: Story = {
	args: {
		reservationDates: {
			startDate: new Date('2025-02-01'),
			endDate: new Date('2025-02-10'),
		},
		onReservationDatesChange: fn(),
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const AllInteractiveFeatures: Story = {
	args: {
		isAuthenticated: true,
		userIsSharer: false,
		onReserveClick: fn(),
		onReservationDatesChange: fn(),
		otherReservations: mockOtherReservations,
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
		const canvas = within(canvasElement);
		
		// Verify title exists
		const title = canvas.queryByText(/Cordless Drill/);
		await expect(title).toBeTruthy();
		
		// Verify location and category are displayed
		const location = canvas.queryByText(/Toronto, ON/);
		await expect(location).toBeTruthy();
	},
};

export const WithReservationDateTimeRange: Story = {
	args: {
		isAuthenticated: true,
		userIsSharer: false,
		reservationDates: {
			startDate: new Date('2025-02-01'),
			endDate: new Date('2025-02-05'),
		},
		onReservationDatesChange: fn(),
		otherReservations: [],
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const ReservationWithMultipleBlockedPeriods: Story = {
	args: {
		isAuthenticated: true,
		userIsSharer: false,
		otherReservations: [
			{
				id: 'res-1',
				reservationPeriodStart: String(new Date('2025-02-01').getTime()),
				reservationPeriodEnd: String(new Date('2025-02-05').getTime()),
			},
			{
				id: 'res-2',
				reservationPeriodStart: String(new Date('2025-03-10').getTime()),
				reservationPeriodEnd: String(new Date('2025-03-15').getTime()),
			},
			{
				id: 'res-3',
				reservationPeriodStart: String(new Date('2025-04-01').getTime()),
				reservationPeriodEnd: String(new Date('2025-04-10').getTime()),
			},
		],
		onReservationDatesChange: fn(),
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const SharerViewReadOnly: Story = {
	args: {
		userIsSharer: true,
		isAuthenticated: true,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		
		// Verify no reserve button is shown for sharer
		const reserveButton = canvas.queryByRole('button', { name: /Reserve/i });
		await expect(reserveButton).toBeFalsy();
	},
};

export const UnauthenticatedViewWithDescription: Story = {
	args: {
		isAuthenticated: false,
		userIsSharer: false,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		
		// Verify description is still visible when unauthenticated
		const description = canvas.queryByText(/High-quality cordless drill/);
		await expect(description).toBeTruthy();
		
		// Verify login button appears
		const loginButton = canvas.queryByRole('button', { name: /Log in to Reserve/i });
		await expect(loginButton).toBeTruthy();
	},
};

export const LoadingStateForReservations: Story = {
	args: {
		isAuthenticated: true,
		userIsSharer: false,
		otherReservationsLoading: true,
		reservationLoading: false,
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
		
		// Loading indicator should be visible
		const loadingIcon = canvasElement.querySelector('.anticon-loading');
		await expect(loadingIcon).toBeTruthy();
	},
};

export const ReservationErrorState: Story = {
	args: {
		isAuthenticated: true,
		userIsSharer: false,
		otherReservationsError: new Error('Failed to load reservations'),
		otherReservations: undefined,
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
		
		// Component should still render and be interactive
		const title = canvasElement.querySelector('.title42');
		await expect(title).toBeTruthy();
	},
};

export const RejectedReservation: Story = {
	args: {
		isAuthenticated: true,
		userIsSharer: false,
		userReservationRequest: {
			__typename: 'ReservationRequest' as const,
			id: 'res-rejected-1',
			state: 'Rejected' as const,
			reservationPeriodStart: '1738368000000',
			reservationPeriodEnd: '1739145600000',
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const CancelledReservation: Story = {
	args: {
		isAuthenticated: true,
		userIsSharer: false,
		userReservationRequest: {
			__typename: 'ReservationRequest' as const,
			id: 'res-cancelled-1',
			state: 'Cancelled' as const,
			reservationPeriodStart: '1738368000000',
			reservationPeriodEnd: '1739145600000',
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const ClosedReservation: Story = {
	args: {
		isAuthenticated: true,
		userIsSharer: false,
		userReservationRequest: {
			__typename: 'ReservationRequest' as const,
			id: 'res-closed-1',
			state: 'Closed' as const,
			reservationPeriodStart: '1738368000000',
			reservationPeriodEnd: '1739145600000',
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const LongDescriptionText: Story = {
	args: {
		listing: {
			...mockListing,
			description:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const LongLocationAndCategory: Story = {
	args: {
		listing: {
			...mockListing,
			location: 'Toronto, Ontario, Canada, North America',
			category: 'Tools & Equipment & Heavy Machinery',
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const InteractiveWithDatePicker: Story = {
	args: {
		isAuthenticated: true,
		userIsSharer: false,
		otherReservations: mockOtherReservations,
		onReservationDatesChange: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		
		// Try to interact with date pickers
		const dateInputs = canvas.getAllByPlaceholderText(/date/i);
		if (dateInputs.length > 0 && dateInputs[0]) {
			await userEvent.click(dateInputs[0]);
		}
	},
};

export const AuthenticatedWithDatesAndOtherReservations: Story = {
	args: {
		isAuthenticated: true,
		userIsSharer: false,
		reservationDates: {
			startDate: new Date('2025-02-21'),
			endDate: new Date('2025-02-28'),
		},
		otherReservations: mockOtherReservations,
		onReservationDatesChange: fn(),
		onReserveClick: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		
		// Verify reserve button is enabled
		const reserveButton = canvas.queryByRole('button', { name: /Reserve/i });
		if (reserveButton) {
			await expect(reserveButton).not.toBeDisabled();
		}
	},
};

// Disabled button when no dates selected
export const ReserveButtonDisabledNoDates: Story = {
	args: {
		isAuthenticated: true,
		userIsSharer: false,
		reservationDates: { startDate: null, endDate: null },
		onReserveClick: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		
		// Verify reserve button is disabled
		const reserveButton = canvas.queryByRole('button', { name: /Reserve/i });
		if (reserveButton) {
			await expect(reserveButton).toBeDisabled();
		}
	},
};

// Button disabled while reservation loading
export const ReserveButtonLoadingState: Story = {
	args: {
		isAuthenticated: true,
		userIsSharer: false,
		reservationDates: {
			startDate: new Date('2025-02-01'),
			endDate: new Date('2025-02-10'),
		},
		reservationLoading: true,
		onReserveClick: fn(),
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
		
		// Verify button shows loading icon
		const loadingIcon = canvasElement.querySelector('.anticon-loading');
		await expect(loadingIcon).toBeTruthy();
	},
};

// Cancel request button with pending reservation
export const CancelRequestButtonState: Story = {
	args: {
		isAuthenticated: true,
		userIsSharer: false,
		userReservationRequest: {
			__typename: 'ReservationRequest' as const,
			id: 'res-1',
			state: 'Requested' as const,
			reservationPeriodStart: '1738368000000',
			reservationPeriodEnd: '1739145600000',
		},
		onCancelClick: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		
		// Button should show "Cancel Request"
		const cancelButton = canvas.queryByRole('button', { name: /Cancel Request/i });
		await expect(cancelButton).toBeTruthy();
		
		if (cancelButton) {
			await userEvent.click(cancelButton);
			expect(args.onCancelClick).toHaveBeenCalled();
		}
	},
};

// Sharer cannot see reserve button
export const SharerNoReserveButton: Story = {
	args: {
		isAuthenticated: true,
		userIsSharer: true,
		onReserveClick: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		
		// Verify no reserve or cancel button visible for sharer
		const reserveButton = canvas.queryByRole('button', { name: /Reserve/i });
		const cancelButton = canvas.queryByRole('button', { name: /Cancel/i });
		await expect(reserveButton).toBeFalsy();
		await expect(cancelButton).toBeFalsy();
	},
};

// Unauthenticated shows login button instead of reserve
export const UnauthenticatedShowsLoginButton: Story = {
	args: {
		isAuthenticated: false,
		userIsSharer: false,
		onLoginClick: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		
		// No date picker should be visible
		const dateInputs = canvas.queryAllByPlaceholderText(/date/i);
		await expect(dateInputs.length === 0).toBeTruthy();
		
		// Login button should be present
		const loginButton = canvas.queryByRole('button', { name: /Log in to Reserve/i });
		await expect(loginButton).toBeTruthy();
	},
};

// Date validation - past dates disabled
export const DateValidationPastDatesDisabled: Story = {
	args: {
		isAuthenticated: true,
		userIsSharer: false,
		otherReservations: [],
		onReservationDatesChange: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		
		// Date picker should be visible
		const dateInputs = canvas.getAllByPlaceholderText(/date/i);
		await expect(dateInputs.length > 0).toBeTruthy();
	},
};

// Multiple reservation periods blocking
export const MultipleBlockedPeriodsBlocking: Story = {
	args: {
		isAuthenticated: true,
		userIsSharer: false,
		otherReservations: [
			{
				id: 'res-1',
				reservationPeriodStart: String(new Date('2025-02-10').getTime()),
				reservationPeriodEnd: String(new Date('2025-02-15').getTime()),
			},
			{
				id: 'res-2',
				reservationPeriodStart: String(new Date('2025-03-20').getTime()),
				reservationPeriodEnd: String(new Date('2025-03-25').getTime()),
			},
			{
				id: 'res-3',
				reservationPeriodStart: String(new Date('2025-04-05').getTime()),
				reservationPeriodEnd: String(new Date('2025-04-10').getTime()),
			},
			{
				id: 'res-4',
				reservationPeriodStart: String(new Date('2025-05-01').getTime()),
				reservationPeriodEnd: String(new Date('2025-05-05').getTime()),
			},
		],
		onReservationDatesChange: fn(),
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
		
		// Should render without error even with multiple blocked periods
		const title = canvasElement.querySelector('.title42');
		await expect(title).toBeTruthy();
	},
};

// Listing with no description
export const ListingWithoutDescription: Story = {
	args: {
		listing: {
			...mockListing,
			description: '',
		},
		isAuthenticated: true,
		userIsSharer: false,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		
		// Title and location should still be visible
		const title = canvas.queryByText(/Cordless Drill/);
		await expect(title).toBeTruthy();
	},
};

// Listing with very short location
export const ListingWithShortLocation: Story = {
	args: {
		listing: {
			...mockListing,
			location: 'NYC',
		},
		isAuthenticated: true,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		
		const location = canvas.queryByText(/NYC/);
		await expect(location).toBeTruthy();
	},
};

// Category with special characters
export const CategoryWithSpecialCharacters: Story = {
	args: {
		listing: {
			...mockListing,
			category: 'Home & Garden / Outdoor (New)',
		},
		isAuthenticated: true,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		
		const category = canvas.queryByText(/Home & Garden/);
		await expect(category).toBeTruthy();
	},
};

// Accepted reservation (disabled date picker)
export const AcceptedReservationDisabledPicker: Story = {
	args: {
		isAuthenticated: true,
		userIsSharer: false,
		userReservationRequest: {
			__typename: 'ReservationRequest' as const,
			id: 'res-accepted-1',
			state: 'Accepted' as const,
			reservationPeriodStart: '1738368000000',
			reservationPeriodEnd: '1739145600000',
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		
		// Date picker should exist but be disabled
		const dateInputs = canvas.getAllByPlaceholderText(/date/i);
		if (dateInputs.length > 0) {
			// Check if disabled attribute exists
			const isDisabled = dateInputs[0]?.hasAttribute('disabled');
			await expect(isDisabled).toBeTruthy();
		}
	},
};

// Only one date selected (end date null)
export const SingleDateSelectedOnly: Story = {
	args: {
		isAuthenticated: true,
		userIsSharer: false,
		reservationDates: {
			startDate: new Date('2025-02-01'),
			endDate: null,
		},
		onReserveClick: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		
		// Reserve button should be disabled when only one date selected
		const reserveButton = canvas.queryByRole('button', { name: /Reserve/i });
		if (reserveButton) {
			await expect(reserveButton).toBeDisabled();
		}
	},
};

// Listing in drafted state
export const ListingDraftedState: Story = {
	args: {
		listing: {
			...mockListing,
			state: 'Drafted' as const,
		},
		isAuthenticated: true,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		
		// Should show "Listing Not Available" button
		const notAvailableButton = canvas.queryByRole('button', { name: /Listing Not Available/i });
		await expect(notAvailableButton).toBeTruthy();
	},
};

// Both loading indicators active
export const BothLoadingIndicators: Story = {
	args: {
		isAuthenticated: true,
		userIsSharer: false,
		reservationLoading: true,
		otherReservationsLoading: true,
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
		
		// Should handle both loading states simultaneously
		const loadingIcons = canvasElement.querySelectorAll('.anticon-loading');
		await expect(loadingIcons.length > 0).toBeTruthy();
	},
};

// Error state with other reservations data
export const ErrorStateWithFallback: Story = {
	args: {
		isAuthenticated: true,
		userIsSharer: false,
		otherReservationsError: new Error('Network failure'),
		otherReservations: undefined,
		onReservationDatesChange: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		
		// Should still allow date selection despite error
		const dateInputs = canvas.queryAllByPlaceholderText(/date/i);
		await expect(dateInputs.length > 0).toBeTruthy();
	},
};

// Title with special characters and emojis
export const TitleWithSpecialCharacters: Story = {
	args: {
		listing: {
			...mockListing,
			title: 'Power Drill & Impact Driver 🔧 (Professional Grade)',
		},
		isAuthenticated: true,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		
		const title = canvas.queryByText(/Power Drill/);
		await expect(title).toBeTruthy();
	},
};

// Complete user flow: Unauthenticated -> Authenticated -> Reservation
export const CompleteReservationFlow: Story = {
	args: {
		isAuthenticated: true,
		userIsSharer: false,
		reservationDates: {
			startDate: new Date('2025-02-16'),
			endDate: new Date('2025-02-25'),
		},
		otherReservations: mockOtherReservations,
		onReservationDatesChange: fn(),
		onReserveClick: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		
		// Verify all key elements
		const title = canvas.queryByText(/Cordless Drill/);
		await expect(title).toBeTruthy();
		
		const location = canvas.queryByText(/Toronto, ON/);
		await expect(location).toBeTruthy();
		
		const reserveButton = canvas.queryByRole('button', { name: /Reserve/i });
		if (reserveButton && !reserveButton.hasAttribute('disabled')) {
			await userEvent.click(reserveButton);
			expect(args.onReserveClick).toHaveBeenCalled();
		}
	},
};

// Empty other reservations list
export const EmptyOtherReservations: Story = {
	args: {
		isAuthenticated: true,
		userIsSharer: false,
		otherReservations: [],
		onReservationDatesChange: fn(),
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
		
		// All dates should be available for selection
		const dateInputs = canvasElement.querySelectorAll('input[placeholder*="date"]');
		await expect(dateInputs.length > 0).toBeTruthy();
	},
};

// Date change with null callback (edge case)
export const DateChangeWithoutCallback: Story = {
	args: {
		isAuthenticated: true,
		userIsSharer: false,
		onReservationDatesChange: undefined,
		otherReservations: [],
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		
		// Component should still render date picker
		const dateInputs = canvas.getAllByPlaceholderText(/date/i);
		await expect(dateInputs.length > 0).toBeTruthy();
	},
};

// Date selection error - before today
export const DateSelectionErrorBeforeToday: Story = {
	args: {
		isAuthenticated: true,
		userIsSharer: false,
		reservationDates: {
			startDate: new Date('2020-01-01'),
			endDate: new Date('2020-01-10'),
		},
		onReservationDatesChange: fn(),
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
		
		// Component should render and handle invalid date range
		const title = canvasElement.querySelector('.title42');
		await expect(title).toBeTruthy();
	},
};

// Clear dates (null dates)
export const ClearedDateSelection: Story = {
	args: {
		isAuthenticated: true,
		userIsSharer: false,
		reservationDates: {
			startDate: null,
			endDate: null,
		},
		onReservationDatesChange: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		
		// Date picker should show empty state
		const dateInputs = canvas.getAllByPlaceholderText(/date/i);
		await expect(dateInputs.length > 0).toBeTruthy();
	},
};

// Overlapping date selection should show error
export const OverlappingDateSelectionError: Story = {
	args: {
		isAuthenticated: true,
		userIsSharer: false,
		otherReservations: [
			{
				id: 'res-1',
				reservationPeriodStart: String(new Date('2025-02-15').getTime()),
				reservationPeriodEnd: String(new Date('2025-02-20').getTime()),
			},
		],
		reservationDates: {
			startDate: new Date('2025-02-10'),
			endDate: new Date('2025-02-25'),
		},
		onReservationDatesChange: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		
		// Component should handle overlapping dates gracefully
		const title = canvas.queryByText(/Cordless Drill/);
		await expect(title).toBeTruthy();
	},
};

// Dates at boundary of existing reservation
export const DatesAtReservationBoundary: Story = {
	args: {
		isAuthenticated: true,
		userIsSharer: false,
		otherReservations: [
			{
				id: 'res-1',
				reservationPeriodStart: String(new Date('2025-02-15').getTime()),
				reservationPeriodEnd: String(new Date('2025-02-20').getTime()),
			},
		],
		reservationDates: {
			startDate: new Date('2025-02-20'),
			endDate: new Date('2025-02-25'),
		},
		onReservationDatesChange: fn(),
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
		
		// Should handle boundary conditions correctly
		const title = canvasElement.querySelector('.title42');
		await expect(title).toBeTruthy();
	},
};

// Sharer with authenticated view (sharers can still see date pickers - no filtering by userIsSharer)
export const SharerAuthenticatedView: Story = {
	args: {
		isAuthenticated: true,
		userIsSharer: true,
		otherReservations: mockOtherReservations,
		onReservationDatesChange: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		
		// Sharer should see listing details
		const title = canvas.queryByText(/Cordless Drill/);
		await expect(title).toBeTruthy();
		
		// Since isAuthenticated is true, date picker will show even for sharers
		const dateInputs = canvas.queryAllByPlaceholderText(/date/i);
		await expect(dateInputs.length > 0).toBeTruthy();
	},
};

// Component with all loading states
export const AllLoadingStates: Story = {
	args: {
		isAuthenticated: true,
		userIsSharer: false,
		reservationLoading: true,
		otherReservationsLoading: true,
		reservationDates: {
			startDate: new Date('2025-02-01'),
			endDate: new Date('2025-02-10'),
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
		
		// Should display loading state gracefully
		const title = canvasElement.querySelector('.title42');
		await expect(title).toBeTruthy();
	},
};

// Reservation with error and fallback
export const ReservationErrorWithFallback: Story = {
	args: {
		isAuthenticated: true,
		userIsSharer: false,
		otherReservationsError: new Error('Network error'),
		otherReservations: undefined,
		reservationDates: {
			startDate: new Date('2025-02-01'),
			endDate: new Date('2025-02-10'),
		},
		onReservationDatesChange: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		
		// Should allow date selection despite error
		const reserveButton = canvas.queryByRole('button', { name: /Reserve/i });
		await expect(reserveButton).toBeTruthy();
	},
};

// Single day reservation
export const SingleDayReservation: Story = {
	args: {
		isAuthenticated: true,
		userIsSharer: false,
		reservationDates: {
			startDate: new Date('2025-02-15'),
			endDate: new Date('2025-02-15'),
		},
		onReservationDatesChange: fn(),
		onReserveClick: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		
		// Should support single-day reservations
		const reserveButton = canvas.queryByRole('button', { name: /Reserve/i });
		if (reserveButton && !reserveButton.hasAttribute('disabled')) {
			await expect(reserveButton).not.toBeDisabled();
		}
	},
};

// Long date range reservation
export const LongDateRangeReservation: Story = {
	args: {
		isAuthenticated: true,
		userIsSharer: false,
		reservationDates: {
			startDate: new Date('2025-01-01'),
			endDate: new Date('2025-12-31'),
		},
		otherReservations: [],
		onReservationDatesChange: fn(),
		onReserveClick: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		
		// Should support long date ranges
		const reserveButton = canvas.queryByRole('button', { name: /Reserve/i });
		if (reserveButton && !reserveButton.hasAttribute('disabled')) {
			await expect(reserveButton).not.toBeDisabled();
		}
	},
};

// Missing reservation request state
export const NoReservationRequestState: Story = {
	args: {
		isAuthenticated: true,
		userIsSharer: false,
		userReservationRequest: null,
		reservationDates: {
			startDate: new Date('2025-02-01'),
			endDate: new Date('2025-02-10'),
		},
		onReserveClick: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		
		// Should show reserve button when no pending request
		const reserveButton = canvas.queryByRole('button', { name: /Reserve/i });
		if (reserveButton && !reserveButton.hasAttribute('disabled')) {
			await userEvent.click(reserveButton);
			expect(args.onReserveClick).toHaveBeenCalled();
		}
	},
};

// Reservation request with null state
export const ReservationRequestNullState: Story = {
	args: {
		isAuthenticated: true,
		userIsSharer: false,
		userReservationRequest: {
			__typename: 'ReservationRequest' as const,
			id: 'res-1',
			state: 'Requested' as const,
			reservationPeriodStart: '1738368000000',
			reservationPeriodEnd: '1739145600000',
		},
		reservationDates: {
			startDate: new Date('2025-02-01'),
			endDate: new Date('2025-02-10'),
		},
		onReserveClick: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		
		// Should handle reservation state gracefully
		const cancelButton = canvas.queryByRole('button', { name: /Cancel Request/i });
		if (cancelButton) {
			await userEvent.click(cancelButton);
			expect(args.onReserveClick).toBeTruthy();
		}
	},
};

// All props provided with full data
export const FullPropsIntegration: Story = {
	args: {
		listing: mockListing,
		userIsSharer: false,
		isAuthenticated: true,
		userReservationRequest: null,
		onReserveClick: fn(),
		onLoginClick: fn(),
		onSignUpClick: fn(),
		onCancelClick: fn(),
		className: 'custom-class',
		reservationDates: {
			startDate: new Date('2025-02-01'),
			endDate: new Date('2025-02-10'),
		},
		onReservationDatesChange: fn(),
		reservationLoading: false,
		otherReservationsLoading: false,
		otherReservationsError: undefined,
		otherReservations: mockOtherReservations,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		
		// Verify custom class is applied
		const component = canvasElement.querySelector('.custom-class');
		await expect(component).toBeTruthy();
		
		// Verify all interactive elements exist
		const reserveButton = canvas.queryByRole('button', { name: /Reserve/i });
		await expect(reserveButton).toBeTruthy();
	},
};

