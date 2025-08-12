import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApolloLink, execute, Observable } from '@apollo/client';
import { gql } from '@apollo/client';
import type { AuthContextProps } from 'react-oidc-context';
import {
  BaseApolloLink,
  ApolloLinkToAddAuthHeader,
  ApolloLinkToAddCustomHeader,
  ApolloLinkToAddCustomHeaders,
  type CustomHeaders,
  type ApolloClientConfig
} from './apollo-client-links';

// Mock query for testing
const TEST_QUERY = gql`
  query TestQuery {
    test {
      id
      name
    }
  }
`;

// Mock auth context
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

// Mock terminating link that captures requests
const createMockTerminatingLink = () => {
  const requests: any[] = [];
  
  const link = new ApolloLink((operation) => {
    requests.push({
      operationName: operation.operationName,
      variables: operation.variables,
      context: operation.getContext(),
    });
    
    return new Observable(observer => {
      observer.next({ data: { test: { id: '1', name: 'Test' } } });
      observer.complete();
    });
  });

  return { link, requests };
};

describe('Apollo Client Links', () => {
  let mockTerminatingLink: { link: ApolloLink; requests: any[] };

  beforeEach(() => {
    mockTerminatingLink = createMockTerminatingLink();
  });

  describe('BaseApolloLink', () => {
    it('should add standard custom headers to requests', async () => {
      const customHeaders: CustomHeaders = {
        'x-custom-header': 'custom-value',
        'x-app-version': '2.0.0'
      };
      
      const link = ApolloLink.from([
        BaseApolloLink(customHeaders),
        mockTerminatingLink.link
      ]);

      await new Promise<void>((resolve) => {
        execute(link, { query: TEST_QUERY }).subscribe({
          complete: () => resolve()
        });
      });

      expect(mockTerminatingLink.requests).toHaveLength(1);
      const request = mockTerminatingLink.requests[0];
      
      expect(request.context.headers).toBeDefined();
      expect(request.context.headers['x-client-id']).toBe('ui-sharethrift');
      expect(request.context.headers['x-request-id']).toMatch(/^req_\d+_[a-z0-9]+$/);
      expect(request.context.headers['x-custom-header']).toBe('custom-value');
      expect(request.context.headers['x-app-version']).toBe('2.0.0');
    });

    it('should generate unique request IDs for different requests', async () => {
      const link = ApolloLink.from([
        BaseApolloLink(),
        mockTerminatingLink.link
      ]);

      // Execute two requests
      await new Promise<void>((resolve) => {
        execute(link, { query: TEST_QUERY }).subscribe({
          complete: () => resolve()
        });
      });

      await new Promise<void>((resolve) => {
        execute(link, { query: TEST_QUERY }).subscribe({
          complete: () => resolve()
        });
      });

      expect(mockTerminatingLink.requests).toHaveLength(2);
      const requestId1 = mockTerminatingLink.requests[0].context.headers['x-request-id'];
      const requestId2 = mockTerminatingLink.requests[1].context.headers['x-request-id'];
      
      expect(requestId1).not.toBe(requestId2);
      expect(requestId1).toMatch(/^req_\d+_[a-z0-9]+$/);
      expect(requestId2).toMatch(/^req_\d+_[a-z0-9]+$/);
    });
  });

  describe('ApolloLinkToAddAuthHeader', () => {
    it('should add Authorization header when user is authenticated', async () => {
      const mockAuth = createMockAuth(true, 'test-access-token');
      
      const link = ApolloLink.from([
        ApolloLinkToAddAuthHeader(mockAuth),
        mockTerminatingLink.link
      ]);

      await new Promise<void>((resolve) => {
        execute(link, { query: TEST_QUERY }).subscribe({
          complete: () => resolve()
        });
      });

      expect(mockTerminatingLink.requests).toHaveLength(1);
      const request = mockTerminatingLink.requests[0];
      
      expect(request.context.headers).toBeDefined();
      expect(request.context.headers['Authorization']).toBe('Bearer test-access-token');
    });

    it('should not add Authorization header when user is not authenticated', async () => {
      const mockAuth = createMockAuth(false);
      
      const link = ApolloLink.from([
        ApolloLinkToAddAuthHeader(mockAuth),
        mockTerminatingLink.link
      ]);

      await new Promise<void>((resolve) => {
        execute(link, { query: TEST_QUERY }).subscribe({
          complete: () => resolve()
        });
      });

      expect(mockTerminatingLink.requests).toHaveLength(1);
      const request = mockTerminatingLink.requests[0];
      
      expect(request.context.headers).toBeDefined();
      expect(request.context.headers['Authorization']).toBeUndefined();
    });

    it('should not add Authorization header when access_token is missing', async () => {
      const mockAuth = createMockAuth(true); // No access token provided
      
      const link = ApolloLink.from([
        ApolloLinkToAddAuthHeader(mockAuth),
        mockTerminatingLink.link
      ]);

      await new Promise<void>((resolve) => {
        execute(link, { query: TEST_QUERY }).subscribe({
          complete: () => resolve()
        });
      });

      expect(mockTerminatingLink.requests).toHaveLength(1);
      const request = mockTerminatingLink.requests[0];
      
      expect(request.context.headers).toBeDefined();
      expect(request.context.headers['Authorization']).toBeUndefined();
    });
  });

  describe('ApolloLinkToAddCustomHeader', () => {
    it('should add custom header when value is provided', async () => {
      const link = ApolloLink.from([
        ApolloLinkToAddCustomHeader('x-community-id', 'community-123'),
        mockTerminatingLink.link
      ]);

      await new Promise<void>((resolve) => {
        execute(link, { query: TEST_QUERY }).subscribe({
          complete: () => resolve()
        });
      });

      expect(mockTerminatingLink.requests).toHaveLength(1);
      const request = mockTerminatingLink.requests[0];
      
      expect(request.context.headers).toBeDefined();
      expect(request.context.headers['x-community-id']).toBe('community-123');
    });

    it('should not add header when value is null', async () => {
      const link = ApolloLink.from([
        ApolloLinkToAddCustomHeader('x-community-id', null),
        mockTerminatingLink.link
      ]);

      await new Promise<void>((resolve) => {
        execute(link, { query: TEST_QUERY }).subscribe({
          complete: () => resolve()
        });
      });

      expect(mockTerminatingLink.requests).toHaveLength(1);
      const request = mockTerminatingLink.requests[0];
      
      expect(request.context.headers?.['x-community-id']).toBeUndefined();
    });

    it('should not add header when condition is false', async () => {
      const link = ApolloLink.from([
        ApolloLinkToAddCustomHeader('x-community-id', 'community-123', false),
        mockTerminatingLink.link
      ]);

      await new Promise<void>((resolve) => {
        execute(link, { query: TEST_QUERY }).subscribe({
          complete: () => resolve()
        });
      });

      expect(mockTerminatingLink.requests).toHaveLength(1);
      const request = mockTerminatingLink.requests[0];
      
      expect(request.context.headers?.['x-community-id']).toBeUndefined();
    });
  });

  describe('ApolloLinkToAddCustomHeaders', () => {
    it('should add multiple custom headers', async () => {
      const headers: CustomHeaders = {
        'x-feature-flag': 'enabled',
        'x-environment': 'development',
        'x-user-role': 'admin'
      };

      const link = ApolloLink.from([
        ApolloLinkToAddCustomHeaders(headers),
        mockTerminatingLink.link
      ]);

      await new Promise<void>((resolve) => {
        execute(link, { query: TEST_QUERY }).subscribe({
          complete: () => resolve()
        });
      });

      expect(mockTerminatingLink.requests).toHaveLength(1);
      const request = mockTerminatingLink.requests[0];
      
      expect(request.context.headers).toBeDefined();
      expect(request.context.headers['x-feature-flag']).toBe('enabled');
      expect(request.context.headers['x-environment']).toBe('development');
      expect(request.context.headers['x-user-role']).toBe('admin');
    });
  });

  describe('createApolloLinkChain', () => {
    it('should create complete link chain with all headers for authenticated user', async () => {
      const config: ApolloClientConfig = {
        uri: 'http://localhost:4000/graphql',
        batchMax: 10,
        batchInterval: 20,
        customHeaders: {
          'x-app-feature': 'batch-queries'
        }
      };

      const mockAuth = createMockAuth(true, 'authenticated-token');
      
      // Create a chain that includes our custom headers but not the terminating HTTP link
      const baseLinks = [
        BaseApolloLink(config.customHeaders),
        ApolloLinkToAddAuthHeader(mockAuth),
      ];
      
      const link = ApolloLink.from([
        ...baseLinks,
        mockTerminatingLink.link
      ]);

      await new Promise<void>((resolve) => {
        execute(link, { query: TEST_QUERY }).subscribe({
          complete: () => resolve()
        });
      });

      expect(mockTerminatingLink.requests).toHaveLength(1);
      const request = mockTerminatingLink.requests[0];
      
      expect(request.context.headers).toBeDefined();
      
      // Check standard headers
      expect(request.context.headers['x-client-id']).toBe('ui-sharethrift');
      expect(request.context.headers['x-request-id']).toMatch(/^req_\d+_[a-z0-9]+$/);
      
      // Check custom config headers
      expect(request.context.headers['x-app-feature']).toBe('batch-queries');
      
      // Check auth header
      expect(request.context.headers['Authorization']).toBe('Bearer authenticated-token');
    });

    it('should create link chain without auth header for unauthenticated user', async () => {
      const config: ApolloClientConfig = {
        uri: 'http://localhost:4000/graphql',
        customHeaders: {
          'x-public-endpoint': 'true'
        }
      };

      const mockAuth = createMockAuth(false);
      
      // Create a chain that includes our custom headers but not the terminating HTTP link
      const baseLinks = [
        BaseApolloLink(config.customHeaders),
        ApolloLinkToAddAuthHeader(mockAuth),
      ];
      
      const link = ApolloLink.from([
        ...baseLinks,
        mockTerminatingLink.link
      ]);

      await new Promise<void>((resolve) => {
        execute(link, { query: TEST_QUERY }).subscribe({
          complete: () => resolve()
        });
      });

      expect(mockTerminatingLink.requests).toHaveLength(1);
      const request = mockTerminatingLink.requests[0];
      
      expect(request.context.headers).toBeDefined();
      
      // Check standard headers are still added
      expect(request.context.headers['x-client-id']).toBe('ui-sharethrift');
      expect(request.context.headers['x-request-id']).toMatch(/^req_\d+_[a-z0-9]+$/);
      
      // Check custom config headers
      expect(request.context.headers['x-public-endpoint']).toBe('true');
      
      // Check auth header is not present
      expect(request.context.headers['Authorization']).toBeUndefined();
    });
  });
});