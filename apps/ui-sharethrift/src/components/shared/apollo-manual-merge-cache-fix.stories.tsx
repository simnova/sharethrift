import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { ApolloManualMergeCacheFix } from './apollo-manual-merge-cache-fix.ts';

// Simple component to display cache status
const ApolloCacheTest = () => {
	return (
		<div style={{ padding: '20px' }}>
			<h2>Apollo Manual Merge Cache Fix</h2>
			<p data-testid="cache-exists">
				Cache exists: {ApolloManualMergeCacheFix ? 'Yes' : 'No'}
			</p>
		</div>
	);
};

const meta: Meta<typeof ApolloCacheTest> = {
	title: 'Shared/Utilities/ApolloCache',
	component: ApolloCacheTest,
	parameters: {
		layout: 'centered',
	},
  tags: ['!dev'], // functional testing story, not rendered in sidebar - https://storybook.js.org/docs/writing-stories/tags
};

export default meta;
type Story = StoryObj<typeof ApolloCacheTest>;

export const Default: Story = {
	play: ({ canvasElement }) => {
		// Verify InMemoryCache was created
		expect(ApolloManualMergeCacheFix).toBeTruthy();
		expect(typeof ApolloManualMergeCacheFix.extract).toBe('function');
		expect(typeof ApolloManualMergeCacheFix.restore).toBe('function');

		expect(canvasElement).toBeTruthy();
	},
};
