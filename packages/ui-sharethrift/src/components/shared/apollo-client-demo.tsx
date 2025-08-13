import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Button } from 'antd';

// Simple test query to demonstrate headers
const TEST_QUERY = gql`
  query TestHeaders {
    __typename
  }
`;

export const ApolloClientDemo: React.FC = () => {
  const { data, loading, error, refetch } = useQuery(TEST_QUERY, {
    errorPolicy: 'all',
    // Don't execute on mount, we'll trigger manually
    skip: true
  });

  const handleTestRequest = () => {
    console.log('🚀 Triggering GraphQL request to test headers...');
    refetch();
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px', borderRadius: '8px' }}>
      <h3>Apollo Client Header Demo</h3>
      <p>
        Click the button below to trigger a GraphQL request and check the network tab 
        to see the headers being sent automatically:
      </p>
      
      <div style={{ marginBottom: '16px' }}>
        <h4>Expected Headers:</h4>
        <ul>
          <li><code>x-client-id</code>: ui-sharethrift</li>
          <li><code>x-request-id</code>: req_[timestamp]_[random]</li>
          <li><code>x-app-version</code>: 1.0.0 (or from VITE_APP_VERSION)</li>
          <li><code>Authorization</code>: Bearer [token] (if authenticated)</li>
        </ul>
      </div>

      <Button 
        type="primary" 
        onClick={handleTestRequest}
        loading={loading}
        style={{ marginBottom: '16px' }}
      >
        Test GraphQL Request with Headers
      </Button>

      {loading && <p>Loading...</p>}
      {error && (
        <div style={{ color: 'red', marginTop: '8px' }}>
          <strong>Error (expected if no GraphQL server):</strong>
          <pre style={{ fontSize: '12px', background: '#ffeaea', padding: '8px', borderRadius: '4px' }}>
            {error.message}
          </pre>
        </div>
      )}
      {data && (
        <div style={{ color: 'green', marginTop: '8px' }}>
          <strong>Success:</strong> Request completed successfully!
        </div>
      )}

      <div style={{ marginTop: '16px', fontSize: '12px', color: '#666' }}>
        <strong>To verify headers:</strong>
        <ol>
          <li>Open browser DevTools (F12)</li>
          <li>Go to Network tab</li>
          <li>Click the button above</li>
          <li>Look for the GraphQL request</li>
          <li>Check the Request Headers section</li>
        </ol>
      </div>
    </div>
  );
};