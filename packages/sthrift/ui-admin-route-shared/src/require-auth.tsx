import type { JSX } from 'react';
import { RequireAuth as RequireAuthBase } from '@sthrift/ui-shared';

const { VITE_B2C_ADMIN_REDIRECT_URI } = import.meta.env;

interface RequireAuthProps {
	children: JSX.Element;
	redirectPath?: string;
	forceLogin?: boolean;
}

export const RequireAuth: React.FC<RequireAuthProps> = (props) => (
	<RequireAuthBase
		{...props}
		silentRedirectUri={VITE_B2C_ADMIN_REDIRECT_URI ?? ''}
	/>
);
