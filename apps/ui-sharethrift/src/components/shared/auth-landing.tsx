import { Navigate } from 'react-router-dom';

export const AuthLanding: React.FC = () => {
	return <Navigate to="/signup/select-account-type" />;
};
