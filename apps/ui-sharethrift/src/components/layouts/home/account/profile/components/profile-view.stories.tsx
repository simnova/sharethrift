import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { MemoryRouter } from 'react-router-dom';
import { ProfileView } from './profile-view';

const mockUser = {
	id: '1',
	firstName: 'John',
	lastName: 'Doe',
	username: 'johndoe',
	email: 'john@example.com',
	accountType: 'personal',
	location: {
		city: 'San Francisco',
		state: 'CA',
	},
	createdAt: '2023-01-15',
};

const meta: Meta<typeof ProfileView> = {
	title: 'Components/ProfileView',
	component: ProfileView,
	parameters: {
		layout: 'fullscreen',
	},
	decorators: [
		(Story) => (
			<MemoryRouter>
				<Story />
			</MemoryRouter>
		),
	],
};

export default meta;
type Story = StoryObj<typeof ProfileView>;

export const Default: Story = {
	args: {
		user: mockUser,
		listings: [],
		isOwnProfile: true,
		onEditSettings: () => console.log('Edit settings clicked'),
		onListingClick: (_id: string) => console.log('Listing clicked'),
	},
	play: async ({ canvasElement }) => {
		expect(canvasElement).toBeTruthy();
	},
};
