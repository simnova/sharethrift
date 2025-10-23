import { Route, Routes, Navigate } from "react-router-dom";
import { HomeRoutes } from "./components/layouts/home/index.tsx";
import { ApolloConnection } from "./components/shared/apollo-connection.tsx";
import { SignupRoutes } from "./components/layouts/signup/Index.tsx";
import { RequireAuth } from "./components/shared/require-auth.tsx";
import { AuthLanding } from "./components/shared/auth-landing.tsx";
import { LoginSelection } from "./components/shared/login-selection.tsx";
import { AuthRedirectLogin } from "./components/shared/auth-redirect-login.tsx";

const authSection = (
  <RequireAuth redirectPath="/" forceLogin={true}>
    <AuthLanding />
  </RequireAuth>
);

const App: React.FC = () => {
  return (
    <ApolloConnection>
      <Routes>
        <Route path="/*" element={<HomeRoutes />} />
        <Route path="/login" element={<LoginSelection />} />
        <Route path="/auth-redirect-login" element={<AuthRedirectLogin />} />
        <Route path="/auth-redirect" element={authSection} />
        <Route path="/signup/*" element={<SignupRoutes />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
      </Routes>
    </ApolloConnection>
  );
};

export default App;
