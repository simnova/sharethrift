import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserAppeal } from './user-appeal';

describe('UserAppeal', () => {
	it('should not render when user is not blocked', () => {
		const { container } = render(
			<UserAppeal
				isBlocked={false}
				onSubmitAppeal={vi.fn()}
			/>,
		);
		expect(container.firstChild).toBeNull();
	});

	it('should render blocked message and appeal form when no existing appeal', () => {
		render(
			<UserAppeal
				isBlocked={true}
				existingAppeal={null}
				onSubmitAppeal={vi.fn()}
			/>,
		);

		expect(screen.getByText('Account Blocked')).toBeInTheDocument();
		expect(screen.getByText('Submit an Appeal')).toBeInTheDocument();
		expect(screen.getByPlaceholderText(/Please explain why/)).toBeInTheDocument();
	});

	it('should call onSubmitAppeal when form is submitted with valid reason', async () => {
		const mockSubmit = vi.fn();
		render(
			<UserAppeal
				isBlocked={true}
				existingAppeal={null}
				onSubmitAppeal={mockSubmit}
			/>,
		);

		const textarea = screen.getByPlaceholderText(/Please explain why/);
		const submitButton = screen.getByText('Submit Appeal');

		fireEvent.change(textarea, {
			target: { value: 'This is my appeal reason that is long enough' },
		});
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(mockSubmit).toHaveBeenCalledWith(
				'This is my appeal reason that is long enough',
			);
		});
	});

	it('should show validation error for too short reason', async () => {
		render(
			<UserAppeal
				isBlocked={true}
				existingAppeal={null}
				onSubmitAppeal={vi.fn()}
			/>,
		);

		const textarea = screen.getByPlaceholderText(/Please explain why/);
		const submitButton = screen.getByText('Submit Appeal');

		fireEvent.change(textarea, { target: { value: 'Short' } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(
				screen.getByText(/Appeal reason must be at least 10 characters/),
			).toBeInTheDocument();
		});
	});

	it('should display existing appeal with REQUESTED status', () => {
		const existingAppeal = {
			id: '1',
			reason: 'My appeal reason',
			state: 'REQUESTED' as const,
			createdAt: new Date().toISOString(),
		};

		render(
			<UserAppeal
				isBlocked={true}
				existingAppeal={existingAppeal}
				onSubmitAppeal={vi.fn()}
			/>,
		);

		expect(screen.getByText('My appeal reason')).toBeInTheDocument();
		expect(screen.getByText('Pending Review')).toBeInTheDocument();
		expect(screen.getByText(/Your appeal is under review/)).toBeInTheDocument();
	});

	it('should display existing appeal with ACCEPTED status', () => {
		const existingAppeal = {
			id: '2',
			reason: 'My appeal reason',
			state: 'ACCEPTED' as const,
			createdAt: new Date().toISOString(),
		};

		render(
			<UserAppeal
				isBlocked={true}
				existingAppeal={existingAppeal}
				onSubmitAppeal={vi.fn()}
			/>,
		);

		expect(screen.getByText('Accepted')).toBeInTheDocument();
		expect(screen.getByText(/Appeal Accepted/)).toBeInTheDocument();
	});

	it('should display existing appeal with DENIED status', () => {
		const existingAppeal = {
			id: '3',
			reason: 'My appeal reason',
			state: 'DENIED' as const,
			createdAt: new Date().toISOString(),
		};

		render(
			<UserAppeal
				isBlocked={true}
				existingAppeal={existingAppeal}
				onSubmitAppeal={vi.fn()}
			/>,
		);

		expect(screen.getByText('Denied')).toBeInTheDocument();
		expect(screen.getByText(/Appeal Denied/)).toBeInTheDocument();
	});

	it('should disable submit button when loading', () => {
		render(
			<UserAppeal
				isBlocked={true}
				existingAppeal={null}
				onSubmitAppeal={vi.fn()}
				loading={true}
			/>,
		);

		const submitButton = screen.getByText('Submit Appeal');
		expect(submitButton).toBeDisabled();
	});
});
