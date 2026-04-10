import { Route, Routes } from 'react-router-dom';
import { AppRoutes } from './components/layouts/app/index.tsx';
import type React from 'react';
import SignupRoutes from './components/layouts/signup/index.tsx';
import { PersonalLogin } from './components/shared/personal-login.tsx';
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
			<Route path="/login" element={<PersonalLogin />} />
			<Route path="/auth-redirect-user" element={<AuthRedirectUser />} />
			<Route path="/signup/*" element={signupSection} />
		</Routes>
	);
};
