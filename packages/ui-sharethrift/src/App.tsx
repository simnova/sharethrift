
import { Navigate, Route, Routes } from 'react-router-dom';
import SignupRoutes from './components/layouts/signup/Index';
import HomeRoutes from './components/layouts/home';


function App() {
  return (
    <Routes>
      <Route path="/*" element={<HomeRoutes />} />
      <Route path="/signup/*" element={<SignupRoutes />} />
      <Route path="/" element={<Navigate to="/home/listings" replace />} />
    </Routes>
  );
}

export default App
