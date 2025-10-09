import type { Meta, StoryObj } from '@storybook/react';
import { SelectAccountType } from '../components/select-account-type.tsx';
import { MemoryRouter } from 'react-router-dom';

// Mock data matching the GraphQL query shape
const mockUserDataNonVerified = {
	id: 'mock-user-id-1',
	account: {
		accountType: 'non-verified-personal',
	},
};

const mockUserDataVerified = {
	id: 'mock-user-id-2',
	account: {
		accountType: 'verified-personal',
	},
};

const mockUserDataVerifiedPlus = {
	id: 'mock-user-id-3',
	account: {
		accountType: 'verified-personal-plus',
	},
};

// Mock handlers
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
		currentUserData: mockUserDataNonVerified,
		loadingUser: false,
		handleUpdateAccountType,
		savingAccountType: false,
	},
};

export const VerifiedPersonal: Story = {
	args: {
		currentUserData: mockUserDataVerified,
		loadingUser: false,
		handleUpdateAccountType,
		savingAccountType: false,
	},
};

export const VerifiedPersonalPlus: Story = {
	args: {
		currentUserData: mockUserDataVerifiedPlus,
		loadingUser: false,
		handleUpdateAccountType,
		savingAccountType: false,
	},
};

export const Loading: Story = {
	args: {
		currentUserData: mockUserDataNonVerified,
		loadingUser: true,
		handleUpdateAccountType,
		savingAccountType: false,
	},
};

export const Saving: Story = {
	args: {
		currentUserData: mockUserDataNonVerified,
		loadingUser: false,
		handleUpdateAccountType,
		savingAccountType: true,
	},
};
