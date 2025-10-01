import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
export const useHasCompletedOnboardingCheck = (
	hasCompletedOnboarding?: boolean,
) => {
	const navigate = useNavigate();
	useEffect(() => {
		if (hasCompletedOnboarding) {
			navigate(`/home`);
		} else {
			navigate(`/signup/select-account-type`);
		}
	}, [hasCompletedOnboarding, navigate]);
};
