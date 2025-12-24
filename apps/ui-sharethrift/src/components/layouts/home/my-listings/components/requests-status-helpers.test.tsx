import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { getActionButtons, getStatusTagClass } from './requests-status-helpers.tsx';
import type { ListingRequestData } from './my-listings-dashboard.types.ts';

const baseRequest: ListingRequestData = {
	id: 'req-1',
	title: 'Test Listing',
	requestedBy: 'Test User',
	requestedOn: '2024-01-01',
	reservationPeriod: '2024-02-01 - 2024-02-15',
	status: 'Pending',
};

describe('getStatusTagClass', () => {
	it('maps known statuses to css classes', () => {
		expect(getStatusTagClass('Accepted')).toBe('requestAcceptedTag');
		expect(getStatusTagClass('Rejected')).toBe('requestRejectedTag');
		expect(getStatusTagClass('Closed')).toBe('expiredTag');
		expect(getStatusTagClass('Pending')).toBe('pendingTag');
		expect(getStatusTagClass('Requested')).toBe('pendingTag');
		expect(getStatusTagClass('Closing')).toBe('closingTag');
		expect(getStatusTagClass('Expired')).toBe('expiredTag');
	});

	it('returns empty string for unknown values', () => {
		expect(getStatusTagClass('')).toBe('');
		expect(getStatusTagClass('Unknown')).toBe('');
	});
});

describe('getActionButtons', () => {
	const renderButtonsMarkup = (status: string) => {
		const onAction = vi.fn();
		const buttons = getActionButtons({ ...baseRequest, status }, onAction);
		return renderToStaticMarkup(<div>{buttons}</div>);
	};

	it('shows accept/reject for pending requests', () => {
		const markup = renderButtonsMarkup('Pending');
		expect(markup).toContain('Accept');
		expect(markup).toContain('Reject');
	});

	it('shows close/message for accepted requests', () => {
		const markup = renderButtonsMarkup('Accepted');
		expect(markup).toContain('Close');
		expect(markup).toContain('Message');
	});

	it('shows message for closed requests', () => {
		const markup = renderButtonsMarkup('Closed');
		expect(markup).toContain('Message');
	});

	it('shows delete for rejected requests', () => {
		const markup = renderButtonsMarkup('Rejected');
		expect(markup).toContain('Delete');
	});

	it('shows delete for expired requests', () => {
		const markup = renderButtonsMarkup('Expired');
		expect(markup).toContain('Delete');
	});

	it('shows delete for cancelled requests', () => {
		const markup = renderButtonsMarkup('Cancelled');
		expect(markup).toContain('Delete');
	});
});
