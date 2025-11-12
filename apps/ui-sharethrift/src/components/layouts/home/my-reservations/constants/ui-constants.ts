/**
 * Shared UI constants for reservation components
 */

/**
 * Base64 encoded placeholder image for when listing images are not available
 * This is a 1x1 transparent PNG that serves as a fallback for Ant Design Image components
 */
export const BASE64_FALLBACK_IMAGE =
	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEEwtkDvAbCLgBxJjNTkHOOkEyMwFBHwgwWLCk4TUwHQl0yBCBfF6QAosdP1AEiB0WQDA8Ccw8IXXQWpFUhgQNQ9VcC1kQQjA7l9gBDp2UgWDUUAX1J6lwI4Qxdaa4dGCiSxqKFaaaDAoW1ZkVmpeIZODAVVfsDAzOGDgWUyRWK4D4s0QEkHRiNg8QyBMz2BYUGiHuAHDOSsQ4P0JsdU4gR7T6eCsxMDAwYGAShGJ9BYuBxZnKhxpaBTl0jLi8vLF9fYuB2dA6PbbSxqDqOsKYzmpF0esLC6QvIA==';

/**
 * Maps GraphQL reservation state enum values to ReservationStatusTag values
 * @param state - The GraphQL reservation state (e.g., 'Accepted', 'Requested', 'Closed')
 * @returns The corresponding ReservationStatusTag value
 * @throws Error if the state is not recognized
 */
export function mapReservationState(
	state: string,
): 'REQUESTED' | 'ACCEPTED' | 'REJECTED' | 'CLOSED' | 'CANCELLED' {
	switch (state) {
		case 'Accepted':
			return 'ACCEPTED';
		case 'Requested':
			return 'REQUESTED';
		case 'Rejected':
			return 'REJECTED';
		case 'Closed':
			return 'CLOSED';
		case 'Cancelled':
			return 'CANCELLED';
		default:
			// Log the unexpected state for debugging
			console.error(
				`Unexpected reservation state: "${state}". Expected one of: Accepted, Requested, Rejected, Closed, Cancelled`,
			);
			throw new Error(
				`Invalid reservation state: "${state}". Expected one of: Accepted, Requested, Rejected, Closed, Cancelled`,
			);
	}
}
