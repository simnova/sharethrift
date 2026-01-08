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

// Action configuration with button properties
type ActionConfig = {
	label: string;
	confirm?: {
		title: string;
		description: string;
	};
	danger?: boolean;
};

const ACTION_CONFIGS: Record<string, ActionConfig> = {
	accept: { label: 'Accept' },
	reject: { label: 'Reject' },
	close: {
		label: 'Close',
		confirm: {
			title: 'Close this request?',
			description: 'Are you sure you want to close this request?',
		},
	},
	message: { label: 'Message' },
	delete: {
		label: 'Delete',
		confirm: {
			title: 'Delete this request?',
			description:
				'Are you sure you want to delete this request? This action cannot be undone.',
		},
		danger: true,
	},
};

// Single status-to-actions mapping
const STATUS_ACTIONS: Record<string, string[]> = {
	Pending: ['accept', 'reject'],
	Requested: ['accept', 'reject'],
	Accepted: ['close', 'message'],
	Closed: ['message'],
	Rejected: ['delete'],
	Expired: ['delete'],
	Cancelled: ['delete'],
};

// Single action button creator
const createActionButton = (
	action: string,
	recordId: string,
	onAction: (action: string, requestId: string) => void,
): React.ReactNode => {
	const config = ACTION_CONFIGS[action];
	if (!config) return null;

	const button = (
		<Button
			key={action}
			type="link"
			size="small"
			onClick={() => onAction(action, recordId)}
			danger={config.danger}
		>
			{config.label}
		</Button>
	);

	if (config.confirm) {
		return (
			<Popconfirm
				key={action}
				title={config.confirm.title}
				description={config.confirm.description}
				onConfirm={() => onAction(action, recordId)}
				okText="Yes"
				cancelText="No"
			>
				{button}
			</Popconfirm>
		);
	}

	return button;
};

export const getActionButtons = (
	record: ListingRequestData,
	onAction: (action: string, requestId: string) => void,
): React.ReactNode[] => {
	const actions = STATUS_ACTIONS[record.status] || [];
	return actions.map((action) =>
		createActionButton(action, record.id, onAction),
	);
};
