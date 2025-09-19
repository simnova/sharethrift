import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';

export function useCreateListingNavigation() {
	const navigate = useNavigate();
	const auth = useAuth();

	return useCallback(() => {
 		if (!auth.isAuthenticated) {
 			// Store the intended destination for after login
 			sessionStorage.setItem('redirectTo', '/create-listing');
 			navigate('/auth-redirect');
 		} else {
 			navigate('/create-listing');
 		}
 	}, [auth.isAuthenticated, navigate]);

}
