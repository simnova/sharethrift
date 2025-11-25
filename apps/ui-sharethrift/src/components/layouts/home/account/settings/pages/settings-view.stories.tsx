import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { MemoryRouter } from 'react-router-dom';
import { SettingsView } from './settings-view';
import type { SettingsUser } from '../components/settings-view.types';

const mockUser: SettingsUser = {
	id: '1',
	firstName: 'John',
	lastName: 'Doe',
	username: 'johndoe',
	email: 'john@example.com',
	createdAt: '2023-01-15',
	accountType: 'verified-personal',
	location: {
		city: 'San Francisco',
		state: 'CA',
	},
};

const meta: Meta<typeof SettingsView> = {
	title: 'Components/SettingsView',
	component: SettingsView,
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
type Story = StoryObj<typeof SettingsView>;

export const Default: Story = {
	args: {
		user: mockUser,
		onEditSection: (_section: string) => console.log('Edit section'),
		onChangePassword: () => console.log('Change password'),
		onSaveSection: async (_section: string, _data: unknown) => {
			console.log('Save section');
		},
	},
	play: async ({ canvasElement }) => {
		expect(canvasElement).toBeTruthy();
	},
};
