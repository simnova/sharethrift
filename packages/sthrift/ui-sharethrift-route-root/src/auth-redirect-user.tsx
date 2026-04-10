import { RequireAuth } from '@sthrift/ui-sharethrift-route-shared';
import { AuthLanding } from './auth-landing.tsx';

export const AuthRedirectUser: React.FC = () => {
	return (
		<RequireAuth redirectPath="/" forceLogin={true}>
			<AuthLanding />
		</RequireAuth>
	);
};
