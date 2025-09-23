import type { Meta, StoryObj } from '@storybook/react';
import {
	ListingBanner,
	type ListingBannerProps,
} from '../components/listing-banner.tsx';

const meta: Meta<typeof ListingBanner> = {
	title: 'Messages/ListingBanner',
	component: ListingBanner,
};
export default meta;
type Story = StoryObj<typeof ListingBanner>;

export const Default: Story = {
	args: {
		title: 'Trek FX 3 Disc',
		owner: 'Alice',
		period: 'Aug 10 - Aug 15',
		status: 'Request Submitted',
		imageUrl: undefined,
	} satisfies ListingBannerProps,
};
