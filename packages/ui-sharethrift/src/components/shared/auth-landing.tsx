import { Navigate } from 'react-router-dom';

export const AuthLanding: React.FC = (_props) => {
  return (
    <Navigate to="/select-account-type" />
  )
};