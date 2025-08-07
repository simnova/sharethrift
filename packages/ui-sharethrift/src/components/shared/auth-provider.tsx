import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { AuthProvider as OidcAuthProvider, useAuth } from 'react-oidc-context';
import { authConfig, mockAuthUser, isDevelopmentMode } from '../../config';

interface SimpleAuthContextType {
  isAuthenticated: boolean;
  user: {
    access_token?: string;
    profile?: {
      name?: string;
      email?: string;
    };
    name?: string;
    email?: string;
  } | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

const SimpleAuthContext = createContext<SimpleAuthContextType | null>(null);

interface SimpleAuthProviderProps {
  children: ReactNode;
}

// Simple auth provider for development mode
export const SimpleAuthProvider: React.FC<SimpleAuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<SimpleAuthContextType['user']>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user was previously authenticated (localStorage for demo)
    const savedAuth = localStorage.getItem('sharethrift-auth');
    if (savedAuth) {
      setIsAuthenticated(true);
      setUser(mockAuthUser);
    }
    setIsLoading(false);
  }, []);

  const signIn = async () => {
    setIsLoading(true);
    // Simulate authentication
    setTimeout(() => {
      setIsAuthenticated(true);
      setUser(mockAuthUser);
      localStorage.setItem('sharethrift-auth', 'true');
      setIsLoading(false);
    }, 1000);
  };

  const signOut = async () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('sharethrift-auth');
  };

  return (
    <SimpleAuthContext.Provider value={{
      isAuthenticated,
      user,
      signIn,
      signOut,
      isLoading
    }}>
      {children}
    </SimpleAuthContext.Provider>
  );
};

// Wrapper component that decides between OIDC and simple auth
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  if (isDevelopmentMode) {
    return <SimpleAuthProvider>{children}</SimpleAuthProvider>;
  }

  // Use real OIDC provider in production
  return (
    <OidcAuthProvider {...authConfig}>
      {children}
    </OidcAuthProvider>
  );
};

// Custom hook that works with both auth providers
export const useAuthContext = () => {
  const simpleAuth = useContext(SimpleAuthContext);
  const oidcAuth = useAuth();

  if (isDevelopmentMode && simpleAuth) {
    return {
      ...simpleAuth,
      // Maintain compatibility with OIDC interface
      signinRedirect: simpleAuth.signIn,
      signoutRedirect: simpleAuth.signOut,
    };
  }

  return {
    ...oidcAuth,
    signIn: oidcAuth.signinRedirect,
    signOut: oidcAuth.signoutRedirect,
  };
};