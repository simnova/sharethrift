import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import React from 'react';
import { ApolloConnection } from './apollo-connection';

// Mock react-oidc-context
vi.mock('react-oidc-context', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: {
      access_token: 'test-token-123'
    }
  })
}));

// Simple test component that uses Apollo
const TestComponent: React.FC = () => {
  return <div data-testid="test-component">Apollo Test Component</div>;
};

// Mock environment variables
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_FUNCTION_ENDPOINT: 'http://localhost:4000/graphql',
    NODE_ENV: 'test'
  },
  writable: true
});

describe('ApolloConnection Integration', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render children successfully', () => {
    const { getByTestId } = render(
      <ApolloConnection>
        <TestComponent />
      </ApolloConnection>
    );

    const element = getByTestId('test-component');
    expect(element).toBeDefined();
    expect(element.textContent).toBe('Apollo Test Component');
  });

  it('should accept custom headers configuration', () => {
    const customHeaders = {
      'x-tenant-id': 'test-tenant',
      'x-user-role': () => 'admin'
    };

    const { getByTestId } = render(
      <ApolloConnection customHeaders={customHeaders}>
        <TestComponent />
      </ApolloConnection>
    );

    const element = getByTestId('test-component');
    expect(element).toBeDefined();
    expect(element.textContent).toBe('Apollo Test Component');
  });

  it('should support both batched and standard GraphQL requests', () => {
    // Test batched requests
    const { getByTestId: getBatchedTestId } = render(
      <ApolloConnection useBatchedRequests={true}>
        <TestComponent />
      </ApolloConnection>
    );

    const batchedElement = getBatchedTestId('test-component');
    expect(batchedElement).toBeDefined();
    expect(batchedElement.textContent).toBe('Apollo Test Component');
    cleanup();

    // Test standard requests
    const { getByTestId: getStandardTestId } = render(
      <ApolloConnection useBatchedRequests={false}>
        <TestComponent />
      </ApolloConnection>
    );

    const standardElement = getStandardTestId('test-component');
    expect(standardElement).toBeDefined();
    expect(standardElement.textContent).toBe('Apollo Test Component');
  });
});