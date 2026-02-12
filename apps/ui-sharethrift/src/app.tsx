import { Route, Routes } from 'react-router-dom';
import { AppRoutes } from './components/layouts/app/index.tsx';
import type React from 'react';
import SignupRoutes from './components/layouts/signup/index.tsx';
import { LoginSelection } from './components/shared/login-selection.tsx';
import { AuthRedirectAdmin } from './components/shared/auth-redirect-admin.tsx';
import { AuthRedirectUser } from './components/shared/auth-redirect-user.tsx';
import { RequireAuth } from './components/shared/require-auth.tsx';
import { useOnboardingRedirect } from './components/shared/use-has-completed-onboarding-check.ts';

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
			<Route path="/login" element={<LoginSelection />} />
			<Route path="/auth-redirect-admin" element={<AuthRedirectAdmin />} />
			<Route path="/auth-redirect-user" element={<AuthRedirectUser />} />
			<Route path="/signup/*" element={signupSection} />
		</Routes>
	);
};
