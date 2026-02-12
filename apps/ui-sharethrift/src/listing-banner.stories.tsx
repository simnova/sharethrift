import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';
import type { PersonalUser } from './generated.tsx';
import { ListingBanner } from './components/layouts/app/pages/messages/components/listing-banner.tsx';

// Mock PersonalUser object for Storybook
const mockUser: PersonalUser = {
	id: '507f1f77bcf86cd799439011',
	__typename: 'PersonalUser',
	account: {
		__typename: 'PersonalUserAccount',
		email: 'alice@example.com',
		username: 'alice_doe',
		profile: {
			__typename: 'PersonalUserAccountProfile',
			firstName: 'Alice',
			lastName: 'Doe',
		},
	},
	userType: 'personal-user',
	hasCompletedOnboarding: true,
	isBlocked: false,
};

const meta: Meta<typeof ListingBanner> = {
	title: 'Components/Listings/ListingBanner',
	component: ListingBanner,
};
export default meta;
type Story = StoryObj<typeof ListingBanner>;

export const Default: Story = {
	args: {
		owner: mockUser,
	} satisfies ComponentProps<typeof ListingBanner>,
};
