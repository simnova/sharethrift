import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Button, Card, Typography, Space, Alert } from 'antd';

const { Title, Text, Paragraph } = Typography;

// Simple test query - this will fail because there's no actual GraphQL server,
// but it will demonstrate the headers being sent
const TEST_QUERY = gql`
  query TestQuery {
    hello
  }
`;

export const ApolloTestComponent: React.FC = () => {
  const { data, loading, error, refetch } = useQuery(TEST_QUERY, {
    errorPolicy: 'all', // Allow us to see network errors
    notifyOnNetworkStatusChange: true
  });

  return (
    <Card style={{ maxWidth: 600, margin: '20px auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={3}>Apollo Client Test</Title>
        
        <Paragraph>
          This component demonstrates the Apollo Client configuration with automatic headers.
          Check the browser's Network tab to see the headers being sent with GraphQL requests:
        </Paragraph>

        <ul>
          <li><strong>x-client-id</strong>: ui-sharethrift-client</li>
          <li><strong>x-request-id</strong>: req-{'{timestamp}'}-{'{random}'}</li>
          <li><strong>Authorization</strong>: Bearer {'{token}'} (when authenticated)</li>
        </ul>

        <Space>
          <Button type="primary" onClick={() => refetch()} loading={loading}>
            {loading ? 'Sending Request...' : 'Test GraphQL Request'}
          </Button>
          
          <Text type="secondary">
            Status: {loading ? 'Loading...' : error ? 'Error (expected)' : 'Completed'}
          </Text>
        </Space>

        {error && (
          <Alert
            type="info"
            message="Expected Network Error"
            description="This error is expected since there's no GraphQL server running. Check the Network tab in browser DevTools to see the request headers that were sent."
            showIcon
          />
        )}

        <Card size="small" title="Instructions to Verify Headers">
          <ol>
            <li>Open browser DevTools (F12)</li>
            <li>Go to the Network tab</li>
            <li>Click the "Test GraphQL Request" button above</li>
            <li>Look for the failed request in the Network tab</li>
            <li>Click on the request to see the headers</li>
            <li>Verify that x-client-id, x-request-id, and other headers are present</li>
          </ol>
        </Card>
      </Space>
    </Card>
  );
};