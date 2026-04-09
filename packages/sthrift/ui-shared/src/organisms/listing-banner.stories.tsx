import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';
import { ListingBanner, type ListingBannerOwner } from './listing-banner.tsx';

const mockUser: ListingBannerOwner = {
	account: {
		profile: {
			firstName: 'Alice',
		},
	},
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
