import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, fn } from 'storybook/test';
import { ListingInformation } from './listing-information.tsx';
import { withMockRouter } from '../../../../../../test-utils/storybook-decorators.tsx';
import { triggerPopconfirmAnd } from '../../../../../../test-utils/popconfirm-test-utils.ts';

const baseReservationRequest = {
	__typename: 'ReservationRequest' as const,
	id: 'res-1',
	reservationPeriodStart: '1738368000000',
	reservationPeriodEnd: '1739145600000',
};

type ReservationState = 'Requested' | 'Accepted';

const createUserReservationRequest = (
	state: ReservationState,
	overrides: Partial<typeof baseReservationRequest> = {},
) => ({
	...baseReservationRequest,
	state,
	...overrides,
});

type CancelFlowOptions = {
	confirm: boolean;
	expectCallback: boolean;
};

const runCancelFlow = async (
	canvasElement: HTMLElement,
	args: Record<string, unknown>,
	{ confirm, expectCallback }: CancelFlowOptions,
) => {
	const canvas = within(canvasElement);
	await expect(canvasElement).toBeTruthy();

	await triggerPopconfirmAnd(canvas, confirm ? 'confirm' : 'cancel', {
		triggerButtonLabel: /Cancel Request/i,
	});

	if (expectCallback) {
		expect(args['onCancelClick']).toHaveBeenCalled();
	} else {
		expect(args['onCancelClick']).not.toHaveBeenCalled();
	}
};

const mockListing = {
	__typename: 'ItemListing' as const,
	listingType: 'item-listing' as const,
	id: '1',
	title: 'Cordless Drill',
	description:
		'High-quality cordless drill for home projects. Perfect for DIY enthusiasts and professionals alike. Features variable speed settings and a comfortable grip.',
	category: 'Tools & Equipment',
	location: 'Toronto, ON',
	state: 'Active' as const,
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
			state: 'Draft' as const,
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
		userReservationRequest: createUserReservationRequest('Requested'),
	},
	play: async ({ canvasElement, args }) => {
		await runCancelFlow(
			canvasElement,
			args as unknown as Record<string, unknown>,
			{
				confirm: true,
				expectCallback: true,
			},
		);
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
		const loginButton = canvas.queryByRole('button', {
			name: /Log in to Reserve/i,
		});
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

export const CancelButtonWithPopconfirm: Story = {
	args: {
		userReservationRequest: createUserReservationRequest('Requested'),
		onCancelClick: fn(),
		cancelLoading: false,
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();

		await triggerPopconfirmAnd(canvas, 'confirm', {
			triggerButtonLabel: /Cancel Request/i,
			expectedTitle: 'Cancel Reservation Request',
		});

		expect(args.onCancelClick).toHaveBeenCalled();
	},
};

export const CancelButtonLoading: Story = {
	args: {
		userReservationRequest: createUserReservationRequest('Requested'),
		cancelLoading: true,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();

		// Verify button is present (loading prop doesn't disable Ant Design Button)
		const cancelButton = canvas.queryByRole('button', {
			name: /Cancel Request/i,
		});
		expect(cancelButton).toBeTruthy();
	},
};

export const NoCancelButtonForAcceptedReservation: Story = {
	args: {
		userReservationRequest: createUserReservationRequest('Accepted'),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();

		// Verify cancel button is NOT present for accepted reservations
		const cancelButton = canvas.queryByRole('button', { name: /Cancel/i });
		expect(cancelButton).toBeNull();
	},
};

export const PopconfirmCancelButton: Story = {
	args: {
		userReservationRequest: createUserReservationRequest('Requested'),
		onCancelClick: fn(),
	},
	play: async ({ canvasElement, args }) => {
		await runCancelFlow(
			canvasElement,
			args as unknown as Record<string, unknown>,
			{
				confirm: false,
				expectCallback: false,
			},
		);
	},
};
