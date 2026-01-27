import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { MemoryRouter } from 'react-router-dom';
import { useCreateListingNavigation } from './use-create-listing-navigation.ts';
import { AuthContext } from 'react-oidc-context';
import { createMockAuth, createMockUser } from '../../../test/utils/mockAuth.ts';
import { MockAuthWrapper } from '../../../test-utils/storybook-mock-auth-wrappers.tsx';

const NavigationTestComponent = () => {
	const handleCreateListing = useCreateListingNavigation();
	
	return (
		<div>
			<button type="button" onClick={handleCreateListing} data-testid="create-listing-btn">
				Create Listing
			</button>
		</div>
	);
};

const meta: Meta = {
	title: 'Hooks/useCreateListingNavigation',
	parameters: {
		layout: 'centered',
	},
  tags: ["!dev"], // not rendered in sidebar - https://storybook.js.org/docs/writing-stories/tags
};

export default meta;
type Story = StoryObj<typeof meta>;

export const HookTest: Story = {
	render: () => (
		<MockAuthWrapper>
			<MemoryRouter>
				<div data-testid="hook-test">Hook test component</div>
			</MemoryRouter>
		</MockAuthWrapper>
	),
	play: () => {
		expect(typeof useCreateListingNavigation).toBe('function');
	},
};

export const AuthenticatedNavigation: Story = {
	render: () => {
		const mockAuth = createMockAuth({
			isAuthenticated: true,
			isLoading: false,
			user: createMockUser(),
		});
		return (
			<AuthContext.Provider value={mockAuth}>
				<MemoryRouter>
					<NavigationTestComponent />
				</MemoryRouter>
			</AuthContext.Provider>
		);
	},
	play:  async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		const button = canvas.getByTestId('create-listing-btn');
		await userEvent.click(button);
		
		expect(button).toBeInTheDocument();
	},
};

export const UnauthenticatedNavigation: Story = {
	render: () => {
		const mockAuth = createMockAuth({
			isAuthenticated: false,
			isLoading: false,
			user: undefined,
		});
		return (
			<AuthContext.Provider value={mockAuth}>
				<MemoryRouter>
					<NavigationTestComponent />
				</MemoryRouter>
			</AuthContext.Provider>
		);
	},
	play:  async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		const button = canvas.getByTestId('create-listing-btn');
		await userEvent.click(button);
		
		const redirectTo = sessionStorage.getItem('redirectTo');
		expect(redirectTo).toBe('/create-listing');
	},
};
