
import { Navigate, Route, Routes } from 'react-router-dom';
import HomeRoutes from './components/layouts/home';
import { ApolloConnection } from './components/shared/apollo-connection';
import SignupRoutes from './components/layouts/signup/Index';
import { AuthProvider } from './contexts/AuthContext';


function App() {
  return (
    <AuthProvider>
      <ApolloConnection>
        <Routes>
          <Route path="/*" element={<HomeRoutes />} />
          <Route path="/signup/*" element={<SignupRoutes />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
        </Routes>
      </ApolloConnection>
    </AuthProvider>
  );
}

export default App
