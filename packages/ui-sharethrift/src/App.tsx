
import { Navigate, Route, Routes } from 'react-router-dom';
import HomeRoutes from './components/layouts/home';
import { ApolloConnection } from './components/shared/apollo-connection';
import SignupRoutes from './components/layouts/signup';


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
