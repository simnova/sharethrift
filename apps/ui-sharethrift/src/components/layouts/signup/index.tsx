import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { SectionLayout } from "./section-layout.tsx";

const SelectAccountTypePage = lazy(() => import("./pages/select-account-type-page.tsx"));
const AccountSetupPage = lazy(() => import("./pages/account-setup-page.tsx"));
const ProfileSetupPage = lazy(() => import("./pages/profile-setup-page.tsx"));
const PaymentPage = lazy(() => import("./pages/payment-page.tsx"));
const TermsPage = lazy(() => import("./pages/terms-page.tsx"));

export const SignupRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route element={<SectionLayout />}>
          <Route path="select-account-type" element={<SelectAccountTypePage />} />
          <Route path="account-setup" element={<AccountSetupPage />} />
          <Route path="profile-setup" element={<ProfileSetupPage />} />
          <Route path="payment" element={<PaymentPage />} />
          <Route path="terms" element={<TermsPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};
