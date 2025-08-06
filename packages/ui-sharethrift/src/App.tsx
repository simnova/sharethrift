
import { Navigate, Route, Routes } from 'react-router-dom';
import SignupRoutes from './components/layouts/signup/Index';
import HomeRoutes from './components/layouts/home';
import { ApolloConnection } from './components/shared/apollo-connection';


function App() {
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
