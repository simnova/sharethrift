import { Route, Routes } from "react-router-dom";
import { SectionLayout } from "./section-layout.tsx";
import SelectAccountTypePage from "./pages/select-account-type-page.tsx";
import AccountSetupPage from "./pages/account-setup-page.tsx";
import ProfileSetupPage from "./pages/profile-setup-page.tsx";
import PaymentPage from "./pages/payment-page.tsx";
import TermsPage from "./pages/terms-page.tsx";

export const SignupRoutes: React.FC = () => {
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
