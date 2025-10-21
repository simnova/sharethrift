import { Route, Routes } from 'react-router-dom';
import { SignupSelectAccountType } from './pages/signup-select-account-type.tsx';
import { AccountSetup } from './pages/AccountSetup.tsx';
import { ProfileSetup } from './pages/ProfileSetup.tsx';
import { Payment } from './pages/Payment.tsx';
import { SectionLayoutContainer } from './section-layout.container.tsx';
import { Terms } from './pages/Terms.tsx';

export const SignupRoutes: React.FC = () => {
	return (
		<Routes>
			<Route element={<SectionLayoutContainer />}>
				<Route
					path="select-account-type"
					element={<SignupSelectAccountType />}
				/>
				<Route path="account-setup" element={<AccountSetup />} />
				<Route path="profile-setup" element={<ProfileSetup />} />
				<Route path="payment" element={<Payment />} />
				<Route path="terms" element={<Terms />} />
			</Route>
		</Routes>
	);
}
