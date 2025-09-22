import { Route, Routes } from 'react-router-dom';
import SignupSelectAccountType from './pages/signup-select-account-type';
import AccountSetup from './pages/AccountSetup';
import ProfileSetup from './pages/ProfileSetup';
import Payment from './pages/Payment';
import {SectionLayoutContainer} from './section-layout.container';
import Terms from './pages/Terms';

export default function SignupRoutes() {
  return (
    <Routes>
      <Route element={<SectionLayoutContainer />}>
        <Route path="select-account-type" element={<SignupSelectAccountType />} />
        <Route path="account-setup" element={<AccountSetup />} />
        <Route path="profile-setup" element={<ProfileSetup />} />
        <Route path="payment" element={<Payment />} />
        <Route path="terms" element={<Terms />} />
      </Route>
    </Routes>
  );
}
