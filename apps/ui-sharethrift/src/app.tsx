import { Route, Routes } from 'react-router-dom';
import { AppRoutes, PersonalLogin, AuthRedirectUser } from '@sthrift/ui-sharethrift-route-root';
import type React from 'react';
import { SignupRoutes } from '@sthrift/ui-sharethrift-route-signup';
import { RequireAuth, useOnboardingRedirect } from '@sthrift/ui-sharethrift-route-shared';

const signupSection = (
	<RequireAuth redirectPath="/" forceLogin={true}>
		<SignupRoutes />
	</RequireAuth>
);

interface AppProps {
	hasCompletedOnboarding: boolean;
	isAuthenticated: boolean;
}
export const App: React.FC<AppProps> = (props) => {
	useOnboardingRedirect(props.hasCompletedOnboarding, props.isAuthenticated);
	return (
		<Routes>
			<Route path="/*" element={<AppRoutes />} />
			<Route path="/login" element={<PersonalLogin />} />
			<Route path="/auth-redirect-user" element={<AuthRedirectUser />} />
			<Route path="/signup/*" element={signupSection} />
		</Routes>
	);
};
