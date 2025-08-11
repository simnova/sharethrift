import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../../shared/molecules/header';
import { Navigation } from '../../shared/molecules/navigation';
import { Footer } from '../../shared/molecules/footer';
import { Footer } from '../../shared/molecules/footer';

export default function HomeTabsLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  // TODO: Replace with real auth state
  const isAuthenticated = true;

  // Map nav keys to routes as defined in index.tsx
  const routeMap: Record<string, string> = {
    home: 'home',
    listings: 'my-listings',
    reservations: 'my-reservations',
    messages: 'messages',
    account: 'account',
    // subnavs can be handled in account/*
  };

  // Determine selectedKey from current location
  const getSelectedKey = () => {
    const path = location.pathname.replace(/^\//, '');
    // Account subroutes
    if (path.startsWith('account/')) {
      const subPath = path.replace('account/', '');
      if (subPath.startsWith('profile')) return 'profile';
      if (subPath.startsWith('settings')) return 'settings';
      // Add more subroutes as needed
      return undefined; // nothing highlighted if not a known subroute
    }
    const found = Object.entries(routeMap).find(([, route]) => path.startsWith(route));
    return found ? found[0] : 'home';
  };

  const handleNavigate = (key: string) => {
    // Handle account subroutes
    const accountSubTabs = ['profile', 'bookmarks', 'settings'];
    if (accountSubTabs.includes(key)) {
      navigate(`/account/${key}`);
      return;
    }
    // If key is already in the form 'account/profile', 'account/settings', etc.
    if (key.startsWith('account/')) {
      navigate(`/${key}`);
      return;
    }
    if (key === 'messages') {
      navigate('/messages');
      return;
    }
    const route = routeMap[key];
    if (route) navigate(`/${route}`);
  };

  return (
    <div style={{ minHeight: '100vh', width: '100vw', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Header isAuthenticated={isAuthenticated} onLogin={() => {}} onSignUp={() => {}} />
      <div style={{ display: 'flex', flexDirection: 'row', flex: 1, height: '100vh', paddingTop: 64 }}>
        <Navigation isAuthenticated={isAuthenticated} onNavigate={handleNavigate} onLogout={() => {}} selectedKey={getSelectedKey()} />
        <main style={{ marginLeft: 240, width: '100%' }}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
