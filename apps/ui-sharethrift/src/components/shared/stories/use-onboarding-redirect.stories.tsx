import type { Meta, StoryObj } from '@storybook/react';
import { useOnboardingRedirect } from '../use-has-completed-onboarding-check.ts';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Test component that uses the hook and displays current location
const OnboardingRedirectTest = ({
	hasCompletedOnboarding,
	isAuthenticated,
}: {
	hasCompletedOnboarding: boolean;
	isAuthenticated: boolean;
}) => {
	const location = useLocation();
	useOnboardingRedirect(hasCompletedOnboarding, isAuthenticated);

	return (
		<div style={{ padding: '20px' }}>
			<h2>Onboarding Redirect Test</h2>
			<p>
				<strong>Current Path:</strong> {location.pathname}
			</p>
			<p>
				<strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}
			</p>
			<p>
				<strong>Has Completed Onboarding:</strong>{' '}
				{hasCompletedOnboarding ? 'Yes' : 'No'}
			</p>
		</div>
	);
};

// Wrapper for testing with specific initial route
const TestWrapper = ({
	initialPath,
	hasCompletedOnboarding,
	isAuthenticated,
}: {
	initialPath: string;
	hasCompletedOnboarding: boolean;
	isAuthenticated: boolean;
}) => {
	const [currentPath, setCurrentPath] = useState(initialPath);

	return (
		<MemoryRouter initialEntries={[initialPath]}>
			<Routes>
				<Route
					path="*"
					element={
						<>
							<OnboardingRedirectTest
								hasCompletedOnboarding={hasCompletedOnboarding}
								isAuthenticated={isAuthenticated}
							/>
							<LocationTracker onPathChange={setCurrentPath} />
						</>
					}
				/>
			</Routes>
			<div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0' }}>
				<strong>Tracked Path:</strong> {currentPath}
			</div>
		</MemoryRouter>
	);
};

// Component to track location changes
const LocationTracker = ({
	onPathChange,
}: {
	onPathChange: (path: string) => void;
}) => {
	const location = useLocation();

	useEffect(() => {
		onPathChange(location.pathname);
	}, [location.pathname, onPathChange]);

	return null;
};

const meta: Meta<typeof TestWrapper> = {
	title: 'Shared/UseOnboardingRedirect',
	component: TestWrapper,
	parameters: {
		layout: 'centered',
	},
  tags: ['!dev'], // functional testing story, not rendered in sidebar - https://storybook.js.org/docs/writing-stories/tags

};

export default meta;
type Story = StoryObj<typeof meta>;

// Scenario 1: Authenticated user, not onboarded, on home page → should redirect to /signup/select-account-type
export const AuthenticatedNotOnboardedOnHome: Story = {
	args: {
		initialPath: '/',
		hasCompletedOnboarding: false,
		isAuthenticated: true,
	},
};

// Scenario 2: Authenticated user, onboarded, on signup page → should redirect to home
export const AuthenticatedOnboardedOnSignup: Story = {
	args: {
		initialPath: '/signup/profile-setup',
		hasCompletedOnboarding: true,
		isAuthenticated: true,
	},
};

// Scenario 3: Authenticated user, not onboarded, on signup page → should stay
export const AuthenticatedNotOnboardedOnSignup: Story = {
	args: {
		initialPath: '/signup/profile-setup',
		hasCompletedOnboarding: false,
		isAuthenticated: true,
	},
};

// Scenario 4: Authenticated user, onboarded, on home page → should stay
export const AuthenticatedOnboardedOnHome: Story = {
	args: {
		initialPath: '/',
		hasCompletedOnboarding: true,
		isAuthenticated: true,
	},
};

// Scenario 5: Not authenticated → should not redirect
export const NotAuthenticated: Story = {
	args: {
		initialPath: '/',
		hasCompletedOnboarding: false,
		isAuthenticated: false,
	},
};
