import { Route, Routes, Navigate } from 'react-router-dom';
import { HomeRoutes } from './components/layouts/home/index.tsx';
import { ApolloConnection } from './components/shared/apollo-connection.tsx';
import { SignupRoutes } from './components/layouts/signup/Index.tsx';
import { LoginSelection } from './components/shared/login-selection.tsx';
import { AuthRedirectAdmin } from './components/shared/auth-redirect-admin.tsx';
import { AuthRedirectUser } from './components/shared/auth-redirect-user.tsx';
import { RequireAuth } from './components/shared/require-auth.tsx';

const signupSection = (
    <RequireAuth redirectPath="/" forceLogin={true}>
        <SignupRoutes />
    </RequireAuth>
);

const App: React.FC = () => {
	return (
		<ApolloConnection>
			<Routes>
				<Route path="/*" element={<HomeRoutes />} />
				<Route path="/login" element={<LoginSelection />} />
				<Route path="/auth-redirect-admin" element={<AuthRedirectAdmin />}/>
				<Route path="/auth-redirect-user" element={<AuthRedirectUser />} />
				<Route path="/signup/*" element={signupSection} />
				<Route path="/" element={<Navigate to="/home" replace />} />
			</Routes>
		</ApolloConnection>
	);
};

export default App;
