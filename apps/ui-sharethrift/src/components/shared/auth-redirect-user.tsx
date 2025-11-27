import { RequireAuth } from './require-auth.tsx';
import { AuthLanding } from './auth-landing.tsx';

export const AuthRedirectUser: React.FC = () => {
	return (
		<RequireAuth redirectPath="/" forceLogin={true}>
			<AuthLanding />
		</RequireAuth>
	);
};
