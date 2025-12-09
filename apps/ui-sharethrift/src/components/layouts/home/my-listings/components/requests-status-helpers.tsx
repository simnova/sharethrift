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

export const getActionButtons = (
	record: ListingRequestData,
	onAction: (action: string, requestId: string) => void,
) => {
	const buttons: React.ReactNode[] = [];

	// Pending/Requested → Accept / Reject
	if (record.status === 'Pending' || record.status === 'Requested') {
		buttons.push(
			<Button
				key="accept"
				type="link"
				size="small"
				onClick={() => onAction('accept', record.id)}
			>
				Accept
			</Button>,
		);
		buttons.push(
			<Button
				key="reject"
				type="link"
				size="small"
				onClick={() => onAction('reject', record.id)}
			>
				Reject
			</Button>,
		);
	}

	// Accepted → Close / Message
	if (record.status === 'Accepted') {
		buttons.push(
			<Popconfirm
				key="close"
				title="Close this request?"
				description="Are you sure you want to close this request?"
				onConfirm={() => onAction('close', record.id)}
				okText="Yes"
				cancelText="No"
			>
				<Button type="link" size="small">
					Close
				</Button>
			</Popconfirm>,
		);
		buttons.push(
			<Button
				key="message"
				type="link"
				size="small"
				onClick={() => onAction('message', record.id)}
			>
				Message
			</Button>,
		);
	}

	// Rejected → Delete / Archive
	if (record.status === 'Rejected') {
		buttons.push(
			<Popconfirm
				key="delete"
				title="Delete this request?"
				description="Are you sure you want to delete this request? This action cannot be undone."
				onConfirm={() => onAction('delete', record.id)}
				okText="Yes"
				cancelText="No"
			>
				<Button type="link" size="small" danger>
					Delete
				</Button>
			</Popconfirm>,
		);
		buttons.push(
			<Button
				key="archive"
				type="link"
				size="small"
				onClick={() => onAction('archive', record.id)}
			>
				Archive
			</Button>,
		);
	}

	// Expired → Archive
	if (record.status === 'Expired') {
		buttons.push(
			<Button
				key="archive"
				type="link"
				size="small"
				onClick={() => onAction('archive', record.id)}
			>
				Archive
			</Button>,
		);
	}

	// Closed → Message (already handled with Accepted above, but adding separately for clarity)
	if (record.status === 'Closed') {
		buttons.push(
			<Button
				key="message"
				type="link"
				size="small"
				onClick={() => onAction('message', record.id)}
			>
				Message
			</Button>,
		);
	}

	// Cancelled → Delete
	if (record.status === 'Cancelled') {
		buttons.push(
			<Popconfirm
				key="delete"
				title="Delete this request?"
				description="Are you sure you want to delete this request? This action cannot be undone."
				onConfirm={() => onAction('delete', record.id)}
				okText="Yes"
				cancelText="No"
			>
				<Button type="link" size="small" danger>
					Delete
				</Button>
			</Popconfirm>,
		);
	}

	return buttons;
};
