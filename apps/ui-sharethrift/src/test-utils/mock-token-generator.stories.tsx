/**
 * Tests for mock token generator utility via Storybook
 *
 * @remarks
 * These stories verify the behavior of the mock token generation utility used
 * throughout Storybook stories and component tests.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { generateMockToken } from './mock-token-generator';

// Test component to display token generation results
const TokenGeneratorTest = ({ testName, testFn }: { testName: string; testFn: () => void }) => {
	try {
		testFn();
		return (
			<div style={{ padding: '20px', border: '2px solid green', borderRadius: '8px' }}>
				<h3 style={{ color: 'green' }}>✓ {testName}</h3>
				<p style={{ color: 'green' }}>Test passed</p>
			</div>
		);
	} catch (error) {
		return (
			<div style={{ padding: '20px', border: '2px solid red', borderRadius: '8px' }}>
				<h3 style={{ color: 'red' }}>✗ {testName}</h3>
				<p style={{ color: 'red' }}>{error instanceof Error ? error.message : String(error)}</p>
			</div>
		);
	}
};

const meta: Meta<typeof TokenGeneratorTest> = {
	title: 'Test Utils/Mock Token Generator',
	component: TokenGeneratorTest,
	parameters: {
		docs: {
			description: {
				component:
					'Tests for the generateMockToken utility function used throughout Storybook stories for authentication mocks.',
			},
		},
	},
} satisfies Meta<typeof TokenGeneratorTest>;

export default meta;
type Story = StoryObj<typeof TokenGeneratorTest>;

export const GeneratesTokenString: Story = {
	name: 'Should generate a token string',
	args: {
		testName: 'Generates token string',
		testFn: () => {
			const token = generateMockToken();
			expect(token).toBeDefined();
			expect(typeof token).toBe('string');
			expect(token.length).toBeGreaterThan(0);
		},
	},
};

export const HasMockPrefix: Story = {
	name: 'Should generate tokens with "mock_" prefix',
	args: {
		testName: 'Has mock_ prefix',
		testFn: () => {
			const token = generateMockToken();
			expect(token).toMatch(/^mock_/);
		},
	},
};

export const MatchesExpectedFormat: Story = {
	name: 'Should generate tokens in expected format',
	args: {
		testName: 'Matches expected format',
		testFn: () => {
			const token = generateMockToken();
			// Expected format: mock_{timestamp}_{random}
			expect(token).toMatch(/^mock_[a-z0-9]+_[a-z0-9]+$/);
		},
	},
};

export const GeneratesUniqueTokens: Story = {
	name: 'Should generate unique tokens on consecutive calls',
	args: {
		testName: 'Generates unique tokens',
		testFn: () => {
			const token1 = generateMockToken();
			const token2 = generateMockToken();
			const token3 = generateMockToken();

			expect(token1).not.toBe(token2);
			expect(token2).not.toBe(token3);
			expect(token1).not.toBe(token3);
		},
	},
};

export const HasThreeParts: Story = {
	name: 'Should have three parts separated by underscores',
	args: {
		testName: 'Has three parts',
		testFn: () => {
			const token = generateMockToken();
			const parts = token.split('_');

			expect(parts).toHaveLength(3);
			expect(parts[0]).toBe('mock');
			expect(parts[1]).toMatch(/^[a-z0-9]+$/);
			expect(parts[2]).toMatch(/^[a-z0-9]+$/);
		},
	},
};

export const HasNonEmptyParts: Story = {
	name: 'Should have non-empty timestamp and random parts',
	args: {
		testName: 'Has non-empty parts',
		testFn: () => {
			const token = generateMockToken();
			const parts = token.split('_');

			expect(parts[1].length).toBeGreaterThan(0);
			expect(parts[2].length).toBeGreaterThan(0);
		},
	},
};

export const WorksInMockStorage: Story = {
	name: 'Should work in mock storage objects',
	args: {
		testName: 'Works in mock storage',
		testFn: () => {
			const token = generateMockToken();
			const mockUser = {
				access_token: token,
				profile: { sub: 'test-user' },
			};

			expect(mockUser.access_token).toBe(token);
			expect(mockUser.access_token).toMatch(/^mock_/);
		},
	},
};

export const HasReasonableLength: Story = {
	name: 'Should have reasonable length',
	args: {
		testName: 'Has reasonable length',
		testFn: () => {
			const token = generateMockToken();
			// Format: "mock_" (5) + timestamp (~8-10) + "_" (1) + random (~13) = ~27-29 chars
			expect(token.length).toBeGreaterThan(20);
			expect(token.length).toBeLessThan(40);
		},
	},
};

export const GeneratesMultipleUniqueTokens: Story = {
	name: 'Should generate multiple unique tokens in a loop',
	args: {
		testName: 'Generates multiple unique tokens',
		testFn: () => {
			const tokens = new Set<string>();
			const iterations = 100;

			for (let i = 0; i < iterations; i++) {
				tokens.add(generateMockToken());
			}

			expect(tokens.size).toBe(iterations);
		},
	},
};
