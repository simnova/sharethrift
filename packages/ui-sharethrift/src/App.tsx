
import { Navigate, Route, Routes } from 'react-router-dom';
import HomeRoutes from './components/layouts/home';
import { ApolloConnection } from './components/shared/apollo-connection';
import SignupRoutes from './components/layouts/signup/Index';
import { RequireAuth } from './components/shared/require-auth';
import { AuthLanding } from './components/shared/auth-landing';


  const authSection = (
    <RequireAuth redirectPath="/" forceLogin={true}>
      <AuthLanding />
    </RequireAuth>
  );

function App() {
  return (
    <ApolloConnection>
    <Routes>
      <Route path="/*" element={<HomeRoutes />} />
      <Route path="/auth-redirect" element={authSection} />
      <Route path="/signup/*" element={<SignupRoutes />} />
      <Route path="/" element={<Navigate to="/home" replace />} />
    </Routes>
    </ApolloConnection>
  );
}

export default App

