import type { AuthProviderProps } from 'react-oidc-context';

// Simple auth configuration for development
// This can be replaced with real B2C configuration later
export const authConfig: AuthProviderProps = {
  // Using a mock OIDC provider for development
  authority: import.meta.env.VITE_AUTH_AUTHORITY || 'http://localhost:7072/api/auth',
  client_id: import.meta.env.VITE_AUTH_CLIENT_ID || 'sharethrift-dev-client',
  redirect_uri: import.meta.env.VITE_AUTH_REDIRECT_URI || `${window.location.origin}/callback`,
  post_logout_redirect_uri: import.meta.env.VITE_AUTH_POST_LOGOUT_REDIRECT_URI || window.location.origin,
  response_type: 'code',
  scope: 'openid profile email',
  automaticSilentRenew: true,
  loadUserInfo: true,
  
  // For development, we'll use a simpler flow
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
};

// For development/testing, we can provide a mock token
export const mockAuthUser = {
  access_token: 'mock-access-token-dev',
  id_token: 'mock-id-token-dev',
  profile: {
    sub: 'user-123',
    name: 'John Doe',
    email: 'john.doe@example.com',
    preferred_username: 'john.doe'
  }
};

export const isDevelopmentMode = import.meta.env.DEV || import.meta.env.VITE_AUTH_MODE === 'development';