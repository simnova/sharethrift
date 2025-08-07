
import { Navigate, Route, Routes } from 'react-router-dom';
import HomeRoutes from './components/layouts/home';
import { ApolloConnection } from './components/shared/apollo-connection';
import SignupRoutes from './components/layouts/signup/Index';
import { useAuthContext } from './components/shared/auth-provider';
import { Login } from './components/shared/login';


function App() {
  const { isAuthenticated, isLoading } = useAuthContext();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <Login />;
  }

  // Show main app if authenticated
  return (
    <ApolloConnection>
    <Routes>
      <Route path="/*" element={<HomeRoutes />} />
      <Route path="/signup/*" element={<SignupRoutes />} />
      <Route path="/" element={<Navigate to="/home" replace />} />
    </Routes>
    </ApolloConnection>
  );
}

export default App
