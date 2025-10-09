import type { Meta, StoryObj } from '@storybook/react';
import { SelectAccountType } from '../components/select-account-type.tsx';
import { MemoryRouter } from 'react-router-dom';

// Mock data matching the GraphQL query shape
const mockUserData = {
	id: 'mock-user-id-1',
	account: {
		accountType: 'non-verified-personal',
	},
};

// Mock handler
const handleUpdateAccountType = (accountType: string) => {
	console.log('Account type updated to:', accountType);
};

const meta: Meta<typeof SelectAccountType> = {
	title: 'Pages/Signup/SelectAccountType',
	component: SelectAccountType,
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
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		currentUserData: mockUserData,
		loadingUser: false,
		handleUpdateAccountType,
		savingAccountType: false,
	},
};
