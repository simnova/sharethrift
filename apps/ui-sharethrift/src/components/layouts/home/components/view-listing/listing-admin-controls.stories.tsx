import type { Meta, StoryObj } from '@storybook/react';
import { MockedProvider } from '@apollo/client/testing/react';
import { InMemoryCache } from '@apollo/client';
import { ListingAdminControls } from './listing-admin-controls.tsx';
import {
	BlockListingDocument,
	UnblockListingDocument,
	ViewListingDocument,
	type ItemListing,
} from '../../../../../generated.tsx';

// Mock listing data
const mockListing: ItemListing = {
	__typename: 'ItemListing',
	id: 'listing-123',
	title: 'Vintage Camera Equipment',
	description: 'Professional vintage camera with accessories for photography enthusiasts.',
	category: 'Photography',
	listingType: 'Item',
	location: 'San Francisco, CA',
	createdAt: '2024-01-15T10:00:00.000Z',
	updatedAt: '2024-01-15T10:00:00.000Z',
	sharingPeriodStart: '2024-02-01T00:00:00.000Z',
	sharingPeriodEnd: '2024-02-28T23:59:59.000Z',
	images: [
		'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400',
		'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400',
	],
	state: 'Active',
	reports: 0,
	schemaVersion: '1.0',
	version: 1,
	sharer: {
		__typename: 'PersonalUser',
		id: 'user-456',
		account: {
			__typename: 'PersonalUserAccount',
			username: 'john_doe',
			email: 'john.doe@example.com',
		},
	},
	sharingHistory: [],
};

// GraphQL Mocks
const successfulBlockMock = {
	request: {
		query: BlockListingDocument,
		variables: { id: 'listing-123' },
	},
	result: {
		data: {
			blockListing: true,
		},
	},
};

const successfulUnblockMock = {
	request: {
		query: UnblockListingDocument,
		variables: { id: 'listing-123' },
	},
	result: {
		data: {
			unblockListing: true,
		},
	},
};

const viewListingRefetchMock = {
	request: {
		query: ViewListingDocument,
		variables: { id: 'listing-123' },
	},
	result: {
		data: {
			itemListing: mockListing,
		},
	},
};

const errorBlockMock = {
	request: {
		query: BlockListingDocument,
		variables: { id: 'listing-123' },
	},
	error: new Error('Failed to block listing'),
};

const errorUnblockMock = {
	request: {
		query: UnblockListingDocument,
		variables: { id: 'listing-123' },
	},
	error: new Error('Failed to unblock listing'),
};

// Story Meta Configuration
const meta: Meta<typeof ListingAdminControls> = {
	title: 'Components/ListingAdminControls',
	component: ListingAdminControls,
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component: `
Admin controls for blocking and unblocking listings. 

**Features:**
- Block listings with reason selection and description
- Unblock previously blocked listings
- Warning banner for blocked listings
- Form validation for block reasons
- Success/error feedback via message notifications
- GraphQL integration with refetch on completion

**Usage:**
Only visible to administrators with appropriate permissions.
				`,
			},
		},
	},
	tags: ['autodocs'],
	argTypes: {
		listing: {
			description: 'The listing object containing id, title and other properties',
			control: false,
		},
		isBlocked: {
			description: 'Whether the listing is currently blocked',
			control: 'boolean',
		},
	},
	decorators: [
		(Story, { parameters }) => (
			<MockedProvider
				mocks={parameters['mocks'] || []}
				cache={new InMemoryCache()}
			>
				<div style={{ maxWidth: '800px', margin: '0 auto' }}>
					<Story />
				</div>
			</MockedProvider>
		),
	],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Stories
export const UnblockedListing: Story = {
	args: {
		listing: mockListing,
		isBlocked: false,
	},
	parameters: {
		mocks: [successfulBlockMock, viewListingRefetchMock],
		docs: {
			description: {
				story: 'Shows the Block Listing button for an active listing.',
			},
		},
	},
};

export const BlockedListing: Story = {
	args: {
		listing: mockListing,
		isBlocked: true,
	},
	parameters: {
		mocks: [successfulUnblockMock, viewListingRefetchMock],
		docs: {
			description: {
				story: 'Shows the warning banner and Unblock Listing button for a blocked listing.',
			},
		},
	},
};

export const BlockListingError: Story = {
	args: {
		listing: mockListing,
		isBlocked: false,
	},
	parameters: {
		mocks: [errorBlockMock, viewListingRefetchMock],
		docs: {
			description: {
				story: 'Demonstrates error handling when blocking a listing fails.',
			},
		},
	},
};

export const UnblockListingError: Story = {
	args: {
		listing: mockListing,
		isBlocked: true,
	},
	parameters: {
		mocks: [errorUnblockMock, viewListingRefetchMock],
		docs: {
			description: {
				story: 'Demonstrates error handling when unblocking a listing fails.',
			},
		},
	},
};

export const LongListingTitle: Story = {
	args: {
		listing: {
			...mockListing,
			title: 'Professional Grade Vintage Camera Equipment Collection with Multiple Lenses and Accessories for Photography Enthusiasts and Professionals',
		},
		isBlocked: false,
	},
	parameters: {
		mocks: [successfulBlockMock, viewListingRefetchMock],
		docs: {
			description: {
				story: 'Tests the component with a very long listing title to verify text handling.',
			},
		},
	},
};

export const InteractiveDemo: Story = {
	args: {
		listing: mockListing,
		isBlocked: false,
	},
	parameters: {
		mocks: [
			successfulBlockMock,
			successfulUnblockMock,
			viewListingRefetchMock,
			// Add multiple mocks for different scenarios
			{
				request: {
					query: BlockListingDocument,
					variables: { id: 'listing-123' },
				},
				result: {
					data: {
						blockListing: {
							__typename: 'ItemListingMutationResult',
							listing: {
								...mockListing,
								state: 'Blocked',
							},
							status: {
								__typename: 'MutationStatus',
								success: true,
								errorMessage: null,
							},
						},
					},
				},
			},
		],
		docs: {
			description: {
				story: `
Interactive demo allowing you to test the full block/unblock flow:

1. Click "Block Listing" to open the block modal
2. Select a reason from the dropdown
3. Add a description explaining the block reason  
4. Click "Block" to submit (simulated success)
5. The listing will show as blocked with warning banner
6. Click "Unblock Listing" to restore the listing

This demonstrates the complete admin workflow for managing listing states.
				`,
			},
		},
	},
};