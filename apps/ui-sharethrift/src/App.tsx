import { Route, Routes, Navigate } from "react-router-dom";
import { HomeRoutes } from "./components/layouts/home/index.tsx";
import { SignupRoutes } from "./components/layouts/signup/Index.tsx";
import { RequireAuth } from "./components/shared/require-auth.tsx";
import { AuthLanding } from "./components/shared/auth-landing.tsx";
import type { FC } from "react";
import { useHasCompletedOnboardingCheck } from "./components/shared/use-has-completed-onboarding-check.ts";

const authSection = (
  <RequireAuth redirectPath="/" forceLogin={true}>
    <AuthLanding />
  </RequireAuth>
);
interface AppProps {
  hasCompletedOnboarding: boolean;
  isAuthenticated: boolean;
}
export const App: FC<AppProps> = (props) => {
  useHasCompletedOnboardingCheck(props.hasCompletedOnboarding, props.isAuthenticated);
  return (
    <Routes>
      <Route path="/*" element={<HomeRoutes />} />
      <Route path="/auth-redirect" element={authSection} />
      <Route path="/signup/*" element={<SignupRoutes />} />
      <Route path="/" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};
