import React from 'react';
import { useAuthContext } from '../shared/auth-provider';

export interface LoginProps {}

export const Login: React.FC<LoginProps> = () => {
  const { isAuthenticated, user, signIn, signOut, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div>Loading authentication...</div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <h2>Welcome to ShareThrift!</h2>
        <div>
          <p>Hello, {(user as any)?.profile?.name || (user as any)?.name || 'User'}!</p>
          <p>Email: {(user as any)?.profile?.email || (user as any)?.email || 'N/A'}</p>
        </div>
        <button 
          onClick={() => signOut()}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <h2>ShareThrift</h2>
      <p>Please sign in to continue</p>
      <button 
        onClick={() => signIn()}
        disabled={isLoading}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          opacity: isLoading ? 0.6 : 1
        }}
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>
    </div>
  );
};