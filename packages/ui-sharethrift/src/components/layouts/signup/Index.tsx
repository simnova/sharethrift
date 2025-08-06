import { Route, Routes } from 'react-router-dom';
import SignupIndex from './Index';
import SelectAccountType from './SelectAccountType';
import Terms from './Terms';
import AccountSetup from './AccountSetup';
import ProfileSetup from './ProfileSetup';
import Payment from './Payment';

export default function SignupRoutes() {
  return (
    <Routes>
      <Route path="signup" element={<SignupIndex />} />
      <Route path="signup/select-account-type" element={<SelectAccountType />} />
      <Route path="signup/personal/terms" element={<Terms />} />
      <Route path="signup/personal/account-setup" element={<AccountSetup />} />
      <Route path="signup/personal/profile-setup" element={<ProfileSetup />} />
      <Route path="signup/personal/payment" element={<Payment />} />
    </Routes>
  );
}
