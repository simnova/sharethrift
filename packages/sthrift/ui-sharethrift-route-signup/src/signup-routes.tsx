import { Route, Routes } from "react-router-dom";
import { SectionLayout } from "./section-layout.tsx";
import SelectAccountTypePage from "./components/pages/select-account-type/pages/select-account-type-page.tsx";
import AccountSetupPage from "./components/pages/account-setup/pages/account-setup-page.tsx";
import ProfileSetupPage from "./components/pages/profile-setup/pages/profile-setup-page.tsx";
import PaymentPage from "./components/pages/payment/pages/payment-page.tsx";
import TermsPage from "./components/pages/terms/pages/terms-page.tsx";

const SignupRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<SectionLayout />}>
        <Route path="select-account-type" element={<SelectAccountTypePage />} />
        <Route path="account-setup" element={<AccountSetupPage />} />
        <Route path="profile-setup" element={<ProfileSetupPage />} />
        <Route path="payment" element={<PaymentPage />} />
        <Route path="terms" element={<TermsPage />} />
      </Route>
    </Routes>
  );
};

export default SignupRoutes;
