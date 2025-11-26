import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { SectionLayoutContainer } from './section-layout.container.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../test-utils/storybook-decorators.tsx';

const meta: Meta<typeof SectionLayoutContainer> = {
	title: 'Containers/SectionLayoutContainer',
	component: SectionLayoutContainer,
	parameters: {
		layout: 'fullscreen',
	},
	decorators: [withMockApolloClient, withMockRouter('/signup')],
};

export default meta;
type Story = StoryObj<typeof SectionLayoutContainer>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};
