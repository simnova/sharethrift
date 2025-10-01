import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function useHasCompletedOnboardingCheck(
	hasCompletedOnboarding: boolean,
	isAuthenticated: boolean,
) {
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const isOnOnboarding = location.pathname.startsWith('/signup');
		const isOnHome = location.pathname.startsWith('/home');

		if (isAuthenticated) {
			if (!hasCompletedOnboarding && isOnHome) {
				// User not onboarded, trying to access home: redirect to onboarding root
				navigate('/signup/select-account-type', { replace: true });
			} else if (hasCompletedOnboarding && isOnOnboarding) {
				// User onboarded, trying to access any onboarding page: redirect to home
				navigate('/home', { replace: true });
			}
		}

		// Otherwise, allow navigation (including onboarding subpages)
	}, [hasCompletedOnboarding, location.pathname, navigate, isAuthenticated]);
}
