import { Route, Routes } from 'react-router-dom';
import SelectAccountType from './components/SelectAccountType';
import Terms from './components/Terms';
import AccountSetup from './components/AccountSetup';
import ProfileSetup from './components/ProfileSetup';
import Payment from './components/Payment';
import SignupLayout from './section-layout';

export default function SignupRoutes() {
  return (
    <Routes>
      <Route element={<SignupLayout />}>
        <Route path="" element={<>Signup Home</>} />
        <Route path="select-account-type" element={<SelectAccountType />} />
        <Route path="terms" element={<Terms />} />
        <Route path="account-setup" element={<AccountSetup />} />
        <Route path="profile-setup" element={<ProfileSetup />} />
        <Route path="payment" element={<Payment />} />
      </Route>
    </Routes>
  );
}
