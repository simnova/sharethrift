import { Outlet, useNavigate } from 'react-router-dom';
import { AppLayout } from '../../shared/organisms/app-layout';
import { useAuth } from '../../../contexts/AuthContext';

export default function HomeTabsLayout() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogin = () => {
    navigate('/signup');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleLogout = () => {
    logout();
    navigate('/home');
  };

  const handleNavigate = (route: string) => {
    // Map the route keys to actual paths
    const routeMap: { [key: string]: string } = {
      'home': '/home',
      'listings': '/my-listings',
      'reservations': '/my-reservations', 
      'messages': '/messages',
      'account': '/account',
      'profile': '/account/profile',
      'bookmarks': '/account/bookmarks',
      'settings': '/account/settings'
    };
    
    const targetRoute = routeMap[route] || `/${route}`;
    navigate(targetRoute);
  };

  return (
    <AppLayout
      isAuthenticated={isAuthenticated}
      onLogin={handleLogin}
      onSignUp={handleSignUp}
      onLogout={handleLogout}
      onNavigate={handleNavigate}
    >
      <Outlet />
    </AppLayout>
  );
}
