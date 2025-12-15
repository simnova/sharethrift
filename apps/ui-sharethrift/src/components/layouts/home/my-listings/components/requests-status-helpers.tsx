// Shared helper functions for Requests components.
// Extracted from requests-table to satisfy react-refresh rule and avoid non-component exports in component files.

import { Button, Popconfirm } from 'antd';
import type React from 'react';
import type { ListingRequestData } from './my-listings-dashboard.types.ts';

export const getStatusTagClass = (status: string): string => {
	switch (status) {
		case 'Accepted':
			return 'requestAcceptedTag';
		case 'Rejected':
			return 'requestRejectedTag';
		case 'Closed':
			return 'expiredTag';
		case 'Pending':
		case 'Requested':
			return 'pendingTag';
		case 'Closing':
			return 'closingTag';
		case 'Expired':
			return 'expiredTag';
		default:
			return '';
	}
};

// Status sets for declarative button rendering
const CAN_ACCEPT_REJECT = new Set(['Pending', 'Requested']);
const CAN_CLOSE = new Set(['Accepted']);
const CAN_MESSAGE = new Set(['Accepted', 'Closed']);
const CAN_DELETE = new Set(['Rejected', 'Expired', 'Cancelled']);

// Reusable button helpers
const createAcceptButton = (
	recordId: string,
	onAction: (action: string, requestId: string) => void,
): React.ReactNode => (
	<Button
		key="accept"
		type="link"
		size="small"
		onClick={() => onAction('accept', recordId)}
	>
		Accept
	</Button>
);

const createRejectButton = (
	recordId: string,
	onAction: (action: string, requestId: string) => void,
): React.ReactNode => (
	<Button
		key="reject"
		type="link"
		size="small"
		onClick={() => onAction('reject', recordId)}
	>
		Reject
	</Button>
);

const createCloseButton = (
	recordId: string,
	onAction: (action: string, requestId: string) => void,
): React.ReactNode => (
	<Popconfirm
		key="close"
		title="Close this request?"
		description="Are you sure you want to close this request?"
		onConfirm={() => onAction('close', recordId)}
		okText="Yes"
		cancelText="No"
	>
		<Button type="link" size="small">
			Close
		</Button>
	</Popconfirm>
);

const createMessageButton = (
	recordId: string,
	onAction: (action: string, requestId: string) => void,
): React.ReactNode => (
	<Button
		key="message"
		type="link"
		size="small"
		onClick={() => onAction('message', recordId)}
	>
		Message
	</Button>
);

const createDeleteButton = (
	recordId: string,
	onAction: (action: string, requestId: string) => void,
): React.ReactNode => (
	<Popconfirm
		key="delete"
		title="Delete this request?"
		description="Are you sure you want to delete this request? This action cannot be undone."
		onConfirm={() => onAction('delete', recordId)}
		okText="Yes"
		cancelText="No"
	>
		<Button type="link" size="small" danger>
			Delete
		</Button>
	</Popconfirm>
);

export const getActionButtons = (
	record: ListingRequestData,
	onAction: (action: string, requestId: string) => void,
): React.ReactNode[] => {
	const buttons: React.ReactNode[] = [];

	// Accept/Reject for pending/requested statuses
	if (CAN_ACCEPT_REJECT.has(record.status)) {
		buttons.push(
			createAcceptButton(record.id, onAction),
			createRejectButton(record.id, onAction),
		);
	}

	// Close button for accepted status
	if (CAN_CLOSE.has(record.status)) {
		buttons.push(createCloseButton(record.id, onAction));
	}

	// Message button for accepted and closed statuses
	if (CAN_MESSAGE.has(record.status)) {
		buttons.push(createMessageButton(record.id, onAction));
	}

	// Delete button for rejected, expired, and cancelled statuses
	if (CAN_DELETE.has(record.status)) {
		buttons.push(createDeleteButton(record.id, onAction));
	}

	return buttons;
};
