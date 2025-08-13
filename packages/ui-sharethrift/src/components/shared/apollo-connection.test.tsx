import { describe, it, expect, vi, beforeEach, type MockedFunction } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import type { AuthContextProps } from 'react-oidc-context';
import { ApolloConnection } from './apollo-connection';

// Mock react-oidc-context
vi.mock('react-oidc-context', () => ({
  useAuth: vi.fn()
}));

// Mock apollo client
vi.mock('@apollo/client', async () => {
  const actual = await vi.importActual('@apollo/client');
  return {
    ...actual,
    ApolloProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="apollo-provider">{children}</div>
  };
});

// Mock apollo client links
vi.mock('./apollo-client-links', () => ({
  client: {
    setLink: vi.fn()
  },
  createApolloLinkChain: vi.fn(() => ({})),
  type: {} // For TypeScript type imports
}));

import { useAuth } from 'react-oidc-context';
import { client, createApolloLinkChain } from './apollo-client-links';

const mockUseAuth = useAuth as MockedFunction<typeof useAuth>;
const mockSetLink = client.setLink as MockedFunction<typeof client.setLink>;
const mockCreateApolloLinkChain = createApolloLinkChain as MockedFunction<typeof createApolloLinkChain>;

describe('ApolloConnection', () => {
  const createMockAuth = (isAuthenticated: boolean = false, accessToken?: string): AuthContextProps => ({
    isAuthenticated,
    user: accessToken ? { 
      access_token: accessToken
    } as any : null,
    isLoading: false,
    activeNavigator: undefined,
    error: undefined,
    signinRedirect: vi.fn(),
    signoutRedirect: vi.fn(),
    clearStaleState: vi.fn(),
    removeUser: vi.fn(),
    signinSilent: vi.fn(),
    signinPopup: vi.fn(),
    signoutPopup: vi.fn(),
    querySessionStatus: vi.fn(),
    revokeTokens: vi.fn(),
    startSilentRenew: vi.fn(),
    stopSilentRenew: vi.fn(),
    settings: {} as any,
  } as any);

  beforeEach(() => {
    vi.clearAllMocks();
    // Set environment variables for tests
    vi.stubEnv('VITE_FUNCTION_ENDPOINT', 'http://localhost:4000/graphql');
    vi.stubEnv('VITE_APP_VERSION', '1.0.0');
  });

  it('should render children wrapped in ApolloProvider', () => {
    mockUseAuth.mockReturnValue(createMockAuth(false));

    render(
      <ApolloConnection>
        <div data-testid="test-child">Test Child</div>
      </ApolloConnection>
    );

    expect(screen.getByTestId('apollo-provider')).toBeDefined();
    expect(screen.getByTestId('test-child')).toBeDefined();
  });

  it('should configure Apollo client with correct settings for authenticated user', () => {
    const mockAuth = createMockAuth(true, 'test-token');
    mockUseAuth.mockReturnValue(mockAuth);

    render(
      <ApolloConnection>
        <div>Test</div>
      </ApolloConnection>
    );

    // Verify that createApolloLinkChain was called with correct config
    expect(mockCreateApolloLinkChain).toHaveBeenCalledWith(
      {
        uri: 'http://localhost:4000/graphql',
        batchMax: 15,
        batchInterval: 50,
        customHeaders: {
          'x-app-version': '1.0.0'
        }
      },
      mockAuth,
      true // batching enabled
    );

    // Verify that the Apollo client link was updated
    expect(mockSetLink).toHaveBeenCalled();
  });

  it('should configure Apollo client with correct settings for unauthenticated user', () => {
    const mockAuth = createMockAuth(false);
    mockUseAuth.mockReturnValue(mockAuth);

    render(
      <ApolloConnection>
        <div>Test</div>
      </ApolloConnection>
    );

    // Verify that createApolloLinkChain was called with correct config
    expect(mockCreateApolloLinkChain).toHaveBeenCalledWith(
      {
        uri: 'http://localhost:4000/graphql',
        batchMax: 15,
        batchInterval: 50,
        customHeaders: {
          'x-app-version': '1.0.0'
        }
      },
      mockAuth,
      true // batching enabled
    );

    // Verify that the Apollo client link was updated
    expect(mockSetLink).toHaveBeenCalled();
  });

  it('should update Apollo client link when auth changes', () => {
    const { rerender } = render(
      <ApolloConnection>
        <div>Test</div>
      </ApolloConnection>
    );

    // First render - unauthenticated
    const mockAuth1 = createMockAuth(false);
    mockUseAuth.mockReturnValue(mockAuth1);

    rerender(
      <ApolloConnection>
        <div>Test</div>
      </ApolloConnection>
    );

    const firstCallCount = mockSetLink.mock.calls.length;

    // Second render - authenticated
    const mockAuth2 = createMockAuth(true, 'new-token');
    mockUseAuth.mockReturnValue(mockAuth2);

    rerender(
      <ApolloConnection>
        <div>Test</div>
      </ApolloConnection>
    );

    // Should have been called again when auth changed
    expect(mockSetLink.mock.calls.length).toBeGreaterThan(firstCallCount);
  });

  it('should use environment variables for configuration', () => {
    vi.stubEnv('VITE_FUNCTION_ENDPOINT', 'https://custom-endpoint.com/graphql');
    vi.stubEnv('VITE_APP_VERSION', '2.0.0');

    const mockAuth = createMockAuth(false);
    mockUseAuth.mockReturnValue(mockAuth);

    render(
      <ApolloConnection>
        <div>Test</div>
      </ApolloConnection>
    );

    expect(mockCreateApolloLinkChain).toHaveBeenCalledWith(
      expect.objectContaining({
        uri: 'https://custom-endpoint.com/graphql',
        customHeaders: expect.objectContaining({
          'x-app-version': '2.0.0'
        })
      }),
      mockAuth,
      true
    );
  });
});