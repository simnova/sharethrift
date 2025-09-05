import { Route, Routes } from 'react-router-dom';
import SelectAccountType from './pages/SelectAccountType';
import AccountSetup from './pages/AccountSetup';
import ProfileSetup from './pages/ProfileSetup';
import Payment from './pages/Payment';
import {SectionLayoutContainer} from './section-layout.container';
import Terms from './pages/Terms';

export default function SignupRoutes() {
  return (
    <Routes>
      <Route element={<SectionLayoutContainer />}>
        <Route path="select-account-type" element={<SelectAccountType />} />
        <Route path="terms" element={<Terms />} />
        <Route path="account-setup" element={<AccountSetup />} />
        <Route path="profile-setup" element={<ProfileSetup />} />
        <Route path="payment" element={<Payment />} />
      </Route>
    </Routes>
  );
}
