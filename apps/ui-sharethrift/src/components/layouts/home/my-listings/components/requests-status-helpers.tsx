// Shared helper functions for Requests components.
// Extracted from requests-table to satisfy react-refresh rule and avoid non-component exports in component files.
import React from 'react';
import { Button, Popconfirm } from 'antd';
import type { ListingRequestData } from './my-listings-dashboard.types';

export function getStatusTagClass(status: string): string {
  switch (status) {
    case 'Accepted':
      return 'requestAcceptedTag';
    case 'Rejected':
      return 'requestRejectedTag';
    case 'Closed':
      return 'expiredTag';
    case 'Pending':
      return 'pendingTag';
    case 'Closing':
      return 'closingTag';
    default:
      return '';
  }
}

export function getActionButtons(record: ListingRequestData, onAction: (action: string, requestId: string) => void) {
  const buttons: React.ReactNode[] = [];

  if (record.status === 'Cancelled' || record.status === 'Rejected') {
    buttons.push(
      <Popconfirm
        key="delete"
        title="Delete this request?"
        description="Are you sure you want to delete this request? This action cannot be undone."
        onConfirm={() => onAction('delete', record.id)}
        okText="Yes"
        cancelText="No"
      >
        <Button type="link" size="small" danger>Delete</Button>
      </Popconfirm>
    );
  }

  if (record.status === 'Closed' || record.status === 'Accepted') {
    buttons.push(
      <Button key="message" type="link" size="small" onClick={() => onAction('message', record.id)}>
        Message
      </Button>
    );
  }

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
        <Button type="link" size="small">Close</Button>
      </Popconfirm>
    );
  }

  if (record.status === 'Pending') {
    buttons.push(
      <Button key="accept" type="link" size="small" onClick={() => onAction('accept', record.id)}>
        Accept
      </Button>
    );
    buttons.push(
      <Button key="reject" type="link" size="small" onClick={() => onAction('reject', record.id)}>
        Reject
      </Button>
    );
  }

  return buttons;
}
