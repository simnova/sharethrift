import { describe, it, expect } from 'vitest';
import { ApolloLink } from '@apollo/client';
import {
  generateRequestId,
  getClientId,
  defaultCustomHeaders,
  BaseApolloLink,
  ApolloLinkToAddAuthHeader,
  ApolloLinkToAddCustomHeader,
  TerminatingApolloLinkForStandardGraphqlServer,
  TerminatingApolloLinkForBatchedGraphqlServer,
} from './apollo-client-links';

// Mock react-oidc-context
const mockAuth = {
  isAuthenticated: false,
  user: null,
};

const mockAuthenticatedUser = {
  isAuthenticated: true,
  user: {
    access_token: 'test-access-token',
  },
};

describe('Apollo Client Links', () => {
  describe('Utility Functions', () => {
    it('should generate unique request IDs', () => {
      const id1 = generateRequestId();
      const id2 = generateRequestId();
      
      expect(id1).toMatch(/^req-\d+-[a-z0-9]+$/);
      expect(id2).toMatch(/^req-\d+-[a-z0-9]+$/);
      expect(id1).not.toBe(id2);
    });

    it('should return consistent client ID', () => {
      const clientId1 = getClientId();
      const clientId2 = getClientId();
      
      expect(clientId1).toBe('ui-sharethrift-client');
      expect(clientId1).toBe(clientId2);
    });

    it('should have default custom headers configuration', () => {
      expect(defaultCustomHeaders).toHaveProperty('x-client-id');
      expect(defaultCustomHeaders).toHaveProperty('x-request-id');
      expect(typeof defaultCustomHeaders['x-client-id']).toBe('function');
      expect(typeof defaultCustomHeaders['x-request-id']).toBe('function');
    });
  });

  describe('BaseApolloLink', () => {
    it('should create an Apollo Link instance', () => {
      const link = BaseApolloLink();
      expect(link).toBeInstanceOf(ApolloLink);
    });

    it('should create an Apollo Link with additional custom headers', () => {
      const additionalHeaders = {
        'x-custom-header': 'custom-value',
        'x-dynamic-header': () => 'dynamic-value',
      };

      const link = BaseApolloLink(additionalHeaders);
      expect(link).toBeInstanceOf(ApolloLink);
    });
  });

  describe('ApolloLinkToAddAuthHeader', () => {
    it('should create an Apollo Link instance for unauthenticated user', () => {
      const authLink = ApolloLinkToAddAuthHeader(mockAuth as any);
      expect(authLink).toBeInstanceOf(ApolloLink);
    });

    it('should create an Apollo Link instance for authenticated user', () => {
      const authLink = ApolloLinkToAddAuthHeader(mockAuthenticatedUser as any);
      expect(authLink).toBeInstanceOf(ApolloLink);
    });
  });

  describe('ApolloLinkToAddCustomHeader', () => {
    it('should create an Apollo Link instance', () => {
      const link = ApolloLinkToAddCustomHeader('x-test-header', 'test-value');
      expect(link).toBeInstanceOf(ApolloLink);
    });

    it('should create an Apollo Link instance for null value', () => {
      const link = ApolloLinkToAddCustomHeader('x-test-header', null);
      expect(link).toBeInstanceOf(ApolloLink);
    });

    it('should create an Apollo Link instance with conditional parameter', () => {
      const link = ApolloLinkToAddCustomHeader('x-test-header', 'test-value', false);
      expect(link).toBeInstanceOf(ApolloLink);
    });
  });

  describe('Terminating Links', () => {
    it('should create standard GraphQL terminating link', () => {
      const link = TerminatingApolloLinkForStandardGraphqlServer({
        uri: 'http://localhost:4000/graphql'
      });

      expect(link).toBeInstanceOf(ApolloLink);
    });

    it('should create batched GraphQL terminating link', () => {
      const link = TerminatingApolloLinkForBatchedGraphqlServer({
        uri: 'http://localhost:4000/graphql',
        batchMax: 10,
        batchInterval: 30
      });

      expect(link).toBeInstanceOf(ApolloLink);
    });

    it('should use default values for batch configuration', () => {
      const link = TerminatingApolloLinkForBatchedGraphqlServer({
        uri: 'http://localhost:4000/graphql'
      });

      expect(link).toBeInstanceOf(ApolloLink);
    });
  });
});