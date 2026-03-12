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

/**
 * Tests that the PersonalUser type policy is configured correctly.
 * This ensures the lodash merge import is working.
 */
export const PersonalUserTypePolicyConfigured: Story = {
	play: ({ canvasElement }) => {
		const config = (ApolloManualMergeCacheFix as any).config;
		
		// Verify PersonalUser type policy exists
		expect(config).toBeDefined();
		expect(config.typePolicies).toBeDefined();
		expect(config.typePolicies.PersonalUser).toBeDefined();
		expect(config.typePolicies.PersonalUser.fields).toBeDefined();
		expect(config.typePolicies.PersonalUser.fields.account).toBeDefined();
		expect(config.typePolicies.PersonalUser.fields.account.merge).toBeDefined();
		
		expect(canvasElement).toBeTruthy();
	},
};

/**
 * Tests that the account merge function works correctly with lodash/merge.
 * This directly tests the change from "import _ from 'lodash'" to "import merge from 'lodash/merge'".
 */
export const LodashMergeFunctionWorks: Story = {
	play: ({ canvasElement }) => {
		const config = (ApolloManualMergeCacheFix as any).config;
		const accountMerge = config.typePolicies.PersonalUser.fields.account.merge;
		
		// Test merging existing and incoming data
		const existing = { name: 'John', age: 30 };
		const incoming = { age: 31, email: 'john@example.com' };
		
		const result = accountMerge(existing, incoming);
		
		// Verify the merge function (using lodash/merge) works correctly
		expect(result).toEqual({
			name: 'John',
			age: 31,
			email: 'john@example.com',
		});
		
		// Verify original objects weren't mutated (merge creates new object)
		expect(existing).toEqual({ name: 'John', age: 30 });
		expect(incoming).toEqual({ age: 31, email: 'john@example.com' });
		
		expect(canvasElement).toBeTruthy();
	},
};

/**
 * Tests deep merging with nested objects using lodash/merge.
 * This ensures the tree-shaken import works the same as the full lodash import.
 */
export const DeepMergeBehavior: Story = {
	play: ({ canvasElement }) => {
		const config = (ApolloManualMergeCacheFix as any).config;
		const accountMerge = config.typePolicies.PersonalUser.fields.account.merge;
		
		const existing = {
			user: { name: 'John', preferences: { theme: 'dark' } },
		};
		const incoming = {
			user: { age: 30, preferences: { language: 'en' } },
		};
		
		const result = accountMerge(existing, incoming);
		
		// Verify deep merge preserves nested properties
		expect(result).toEqual({
			user: {
				name: 'John',
				age: 30,
				preferences: {
					theme: 'dark',
					language: 'en',
				},
			},
		});
		
		expect(canvasElement).toBeTruthy();
	},
};

/**
 * Tests merge behavior when existing data is undefined.
 */
export const MergeWithUndefinedExisting: Story = {
	play: ({ canvasElement }) => {
		const config = (ApolloManualMergeCacheFix as any).config;
		const accountMerge = config.typePolicies.PersonalUser.fields.account.merge;
		
		const incoming = { name: 'Jane', email: 'jane@example.com' };
		const result = accountMerge(undefined, incoming);
		
		expect(result).toEqual({
			name: 'Jane',
			email: 'jane@example.com',
		});
		
		expect(canvasElement).toBeTruthy();
	},
};

/**
 * Tests merge behavior when incoming data is undefined.
 */
export const MergeWithUndefinedIncoming: Story = {
	play: ({ canvasElement }) => {
		const config = (ApolloManualMergeCacheFix as any).config;
		const accountMerge = config.typePolicies.PersonalUser.fields.account.merge;
		
		const existing = { name: 'John', age: 30 };
		const result = accountMerge(existing, undefined);
		
		expect(result).toEqual({
			name: 'John',
			age: 30,
		});
		
		expect(canvasElement).toBeTruthy();
	},
};
