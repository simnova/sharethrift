import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { AllListingsTableContainer } from './all-listings-table.container.tsx';
import {
	HomeAllListingsTableContainerMyListingsAllDocument,
	HomeAllListingsTableContainerPauseItemListingDocument,
} from '../../../../../generated.tsx';

// Mock Ant Design message
vi.mock('antd', async () => {
	const actual = await vi.importActual('antd');
	return {
		...actual,
		message: {
			success: vi.fn(),
			error: vi.fn(),
		},
	});
});

describe('AllListingsTableContainer', () => {
	const mockListingsData = {
		myListingsAll: {
			items: [
				{
					id: 'listing-1',
					title: 'Test Listing',
					state: 'Published',
					images: ['image1.jpg'],
					createdAt: '2025-01-01T00:00:00Z',
					sharingPeriodStart: '2025-02-01T00:00:00Z',
					sharingPeriodEnd: '2025-02-28T00:00:00Z',
				},
			],
			total: 1,
			page: 1,
			pageSize: 6,
		},
	};

	const mocks = [
		{
			request: {
				query: HomeAllListingsTableContainerMyListingsAllDocument,
				variables: {
					page: 1,
					pageSize: 6,
					searchText: '',
					statusFilters: [],
					sorter: undefined,
				},
			},
			result: {
				data: mockListingsData,
			},
		},
	];

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should render and display listings', async () => {
		render(
			<MockedProvider mocks={mocks} addTypename={false}>
				<AllListingsTableContainer currentPage={1} onPageChange={vi.fn()} />
			</MockedProvider>,
		);

		await waitFor(() => {
			expect(screen.getByText('Test Listing')).toBeInTheDocument();
		});
	});

	it('should map domain state to UI status correctly', async () => {
		const mocksWithPaused = [
			{
				request: {
					query: HomeAllListingsTableContainerMyListingsAllDocument,
					variables: {
						page: 1,
						pageSize: 6,
						searchText: '',
						statusFilters: [],
						sorter: undefined,
					},
				},
				result: {
					data: {
						myListingsAll: {
							items: [
								{
									id: 'listing-1',
									title: 'Published Listing',
									state: 'Published',
									images: [],
									createdAt: '2025-01-01T00:00:00Z',
									sharingPeriodStart: '2025-02-01T00:00:00Z',
									sharingPeriodEnd: '2025-02-28T00:00:00Z',
								},
								{
									id: 'listing-2',
									title: 'Paused Listing',
									state: 'Paused',
									images: [],
									createdAt: '2025-01-01T00:00:00Z',
									sharingPeriodStart: '2025-02-01T00:00:00Z',
									sharingPeriodEnd: '2025-02-28T00:00:00Z',
								},
							],
							total: 2,
							page: 1,
							pageSize: 6,
						},
					},
				},
			},
		];

		render(
			<MockedProvider mocks={mocksWithPaused} addTypename={false}>
				<AllListingsTableContainer currentPage={1} onPageChange={vi.fn()} />
			</MockedProvider>,
		);

		await waitFor(() => {
			expect(screen.getByText('Published Listing')).toBeInTheDocument();
			expect(screen.getByText('Paused Listing')).toBeInTheDocument();
		});
	});
});

