import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function useOnboardingRedirect(
	hasCompletedOnboarding: boolean,
	isAuthenticated: boolean,
) {
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		// Admin portal sessions never go through onboarding
		const isAdminPortal =
			globalThis.sessionStorage.getItem('loginPortalType') === 'AdminPortal';
		if (isAdminPortal) return;

		const isOnOnboarding = location.pathname.startsWith('/signup');
		const isOnAuthRedirect = location.pathname.startsWith('/auth-redirect');

		if (isAuthenticated) {
			if (!hasCompletedOnboarding && !isOnOnboarding && !isOnAuthRedirect) {
				console.log(
					'Redirecting to onboarding because user has not completed onboarding',
				);
				// User not onboarded, trying to access home: redirect to onboarding root
				navigate('/signup/select-account-type', { replace: true });
			} else if (hasCompletedOnboarding && isOnOnboarding) {
				console.log(
					'Redirecting to home because user has completed onboarding',
				);
				// User onboarded, trying to access any onboarding page: redirect to home
				navigate('/', { replace: true });
			}
		}

		// Otherwise, allow navigation (including onboarding subpages)
	}, [hasCompletedOnboarding, location.pathname, navigate, isAuthenticated]);
}
