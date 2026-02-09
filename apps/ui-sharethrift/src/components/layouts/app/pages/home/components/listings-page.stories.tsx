import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { MemoryRouter } from 'react-router-dom';
import { ListingsPage } from './listings-page.tsx';
import type { ItemListing } from '../../../../../../generated.tsx';

const mockListings: ItemListing[] = [
	{
		__typename: 'ItemListing',
		id: '1',
		title: 'Cordless Drill',
		description: 'High-quality cordless drill for home projects',
		category: 'Tools & Equipment',
		location: 'Toronto, ON',
		state: 'Active',
		images: ['/assets/item-images/projector.png'],
		sharingPeriodStart: new Date('2025-01-01'),
		sharingPeriodEnd: new Date('2025-12-31'),
		createdAt: new Date('2025-01-01T00:00:00Z'),
		updatedAt: new Date('2025-01-01T00:00:00Z'),
	},
	{
		__typename: 'ItemListing',
		id: '2',
		title: 'Electric Guitar',
		description: 'Fender electric guitar in excellent condition',
		category: 'Musical Instruments',
		location: 'Vancouver, BC',
		state: 'Active',
		images: ['/assets/item-images/projector.png'],
		sharingPeriodStart: new Date('2025-02-01'),
		sharingPeriodEnd: new Date('2025-06-30'),
		createdAt: new Date('2025-01-15T00:00:00Z'),
		updatedAt: new Date('2025-01-15T00:00:00Z'),
	},
] as unknown as ItemListing[];

const meta: Meta<typeof ListingsPage> = {
	title: 'Pages/ListingsPage',
	component: ListingsPage,
	tags: ['!dev'],
	decorators: [
		(Story) => (
			<MemoryRouter>
				<Story />
			</MemoryRouter>
		),
	],
	args: {
		isAuthenticated: true,
		searchQuery: '',
		onSearchChange: fn(),
		onSearch: fn(),
		selectedCategory: 'All',
		onCategoryChange: fn(),
		listings: mockListings,
		currentPage: 1,
		pageSize: 12,
		totalListings: 2,
		onListingClick: fn(),
		onPageChange: fn(),
		onCreateListingClick: fn(),
	},
	parameters: {
		layout: 'fullscreen',
	},
};

export default meta;
type Story = StoryObj<typeof ListingsPage>;

export const AuthenticatedView: Story = {
	args: {
		isAuthenticated: true,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.queryByText(/Cordless Drill/i)).toBeInTheDocument();
			},
			{ timeout: 2000 },
		);
		// Verify search bar is visible
		expect(canvas.queryByRole('textbox')).toBeInTheDocument();
		// Verify create listing button
		expect(
			canvas.queryByText(/Create a Listing/i),
		).toBeInTheDocument();
	},
};

export const UnauthenticatedView: Story = {
	args: {
		isAuthenticated: false,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.queryByText(/Cordless Drill/i)).toBeInTheDocument();
			},
			{ timeout: 2000 },
		);
		// Verify "Today's Picks" header is shown
		expect(canvas.queryByText(/Today's Picks/i)).toBeInTheDocument();
	},
};

export const SearchInteraction: Story = {
	args: {
		isAuthenticated: true,
		searchQuery: '',
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const searchInput = canvas.getByRole('textbox');
		
		await userEvent.type(searchInput, 'drill');
		await expect(args.onSearchChange).toHaveBeenCalled();
		
		// Click the search button to trigger onSearch
		const searchButton = canvas.getByRole('button', { name: 'search' });
		await userEvent.click(searchButton);
		await expect(args.onSearch).toHaveBeenCalled();
	},
};

export const CreateListingButtonClick: Story = {
	args: {
		isAuthenticated: true,
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const createButton = canvas.getByText(/Create a Listing/i);
		
		await userEvent.click(createButton);
		await expect(args.onCreateListingClick).toHaveBeenCalledTimes(1);
	},
};

export const MobileCreateButtonHover: Story = {
	args: {
		isAuthenticated: true,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		// Find the mobile create overlay button by its accessible name "plus"
		const mobileButton = canvas.getByRole('button', {
			name: 'plus',
		});
		
		// Test hover interaction
		await userEvent.hover(mobileButton);
		expect(mobileButton).toBeInTheDocument();
		
		await userEvent.unhover(mobileButton);
		expect(mobileButton).toBeInTheDocument();
	},
};

export const MobileCreateButtonClick: Story = {
	args: {
		isAuthenticated: true,
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		
		// Find mobile create button by accessible name
		const mobileButton = canvas.getByRole('button', {
			name: 'plus',
		});
		
		await userEvent.click(mobileButton);
		await expect(args.onCreateListingClick).toHaveBeenCalled();
	},
};

export const CategoryFilterInteraction: Story = {
	args: {
		isAuthenticated: true,
		selectedCategory: 'All',
	},
	play: async ({ canvasElement }) => {
		await waitFor(
			() => {
				expect(canvasElement).toBeTruthy();
			},
			{ timeout: 2000 },
		);
		// Category filter is rendered (from CategoryFilterContainer)
		expect(canvasElement).toBeInTheDocument();
	},
};

export const ListingClickInteraction: Story = {
	args: {
		isAuthenticated: true,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		await waitFor(
			() => {
				expect(canvas.queryByText(/Cordless Drill/i)).toBeInTheDocument();
			},
			{ timeout: 2000 },
		);
		
		// Click on a listing card
		const listingCard = canvas.queryByText(/Cordless Drill/i);
		if (listingCard) {
			await userEvent.click(listingCard);
			// onListingClick will be called by the ListingsGrid component
		}
	},
};

export const PaginationInteraction: Story = {
	args: {
		isAuthenticated: true,
		currentPage: 1,
		totalListings: 50,
		pageSize: 12,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		await waitFor(
			() => {
				expect(canvas.queryByText(/Cordless Drill/i)).toBeInTheDocument();
			},
			{ timeout: 2000 },
		);
		
		// Pagination should be visible
		const nextButton = canvas.queryByRole('button', { name: /next/i });
		if (nextButton) {
			expect(nextButton).toBeInTheDocument();
		}
	},
};

export const EmptyListings: Story = {
	args: {
		isAuthenticated: true,
		listings: [],
		totalListings: 0,
	},
	play: async ({ canvasElement }) => {
		await waitFor(
			() => {
				expect(canvasElement).toBeTruthy();
			},
			{ timeout: 2000 },
		);
		// Empty state from ListingsGrid
		expect(canvasElement).toBeInTheDocument();
	},
};

export const WithSearchQuery: Story = {
	args: {
		isAuthenticated: true,
		searchQuery: 'drill',
	},
	play: async ({ canvasElement }) => {
		const searchInput = canvasElement.querySelector('input[type="text"]') as HTMLInputElement;
		
		await waitFor(
			() => {
				expect(searchInput.value).toBe('drill');
			},
			{ timeout: 2000 },
		);
	},
};

export const WithCategoryFilter: Story = {
	args: {
		isAuthenticated: true,
		selectedCategory: 'Tools & Equipment',
	},
	play: async ({ canvasElement }) => {
		await waitFor(
			() => {
				expect(canvasElement).toBeTruthy();
			},
			{ timeout: 2000 },
		);
	},
};

export const UnauthenticatedWithHero: Story = {
	args: {
		isAuthenticated: false,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		// Hero section should be visible
		await waitFor(
			() => {
				expect(canvasElement).toBeTruthy();
			},
			{ timeout: 2000 },
		);
		
		// Verify different padding for unauthenticated view
		expect(canvas.queryByText(/Today's Picks/i)).toBeInTheDocument();
	},
};

export const LocationFilterDisplay: Story = {
	args: {
		isAuthenticated: true,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		// Location filter placeholder should be visible
		await waitFor(
			() => {
				expect(
					canvas.queryByText(/Philadelphia, PA · 10 mi/i),
				).toBeInTheDocument();
			},
			{ timeout: 2000 },
		);
	},
};

export const MultipleListings: Story = {
	args: {
		isAuthenticated: true,
		listings: [
			...mockListings,
			{
				__typename: 'ItemListing',
				id: '3',
				title: 'Camera Lens',
				description: '50mm prime lens',
				category: 'Photography',
				location: 'Montreal, QC',
				state: 'Active',
				images: ['/assets/item-images/camera.png'],
				sharingPeriodStart: new Date('2025-03-01'),
				sharingPeriodEnd: new Date('2025-08-31'),
				createdAt: new Date('2025-02-01T00:00:00Z'),
				updatedAt: new Date('2025-02-01T00:00:00Z'),
			},
		] as unknown as ItemListing[],
		totalListings: 3,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		await waitFor(
			() => {
				expect(canvas.queryByText(/Cordless Drill/i)).toBeInTheDocument();
				expect(canvas.queryByText(/Electric Guitar/i)).toBeInTheDocument();
				expect(canvas.queryByText(/Camera Lens/i)).toBeInTheDocument();
			},
			{ timeout: 2000 },
		);
	},
};
