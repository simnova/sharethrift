import { Button, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { AllListingsTableContainer } from './all-listings-table.container';
import { RequestsTableContainer } from './requests-table.container';

export interface MyListingsDashboardProps {
  onCreateListing: () => void;
}

export function MyListingsDashboard({ onCreateListing }: MyListingsDashboardProps) {
  const items: TabsProps['items'] = [
    {
      key: 'all-listings',
      label: 'All Listings',
      children: <AllListingsTableContainer />,
    },
    {
      key: 'requests',
      label: (
        <span>
          Requests <span style={{ 
            backgroundColor: '#ff4d4f', 
            color: 'white', 
            borderRadius: '50%', 
            padding: '2px 6px', 
            fontSize: '12px', 
            marginLeft: '4px' 
          }}>6</span>
        </span>
      ),
      children: <RequestsTableContainer />,
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '24px' 
      }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>
          My Listings
        </h1>
        <Button 
          type="primary" 
          size="large"
          onClick={onCreateListing}
          style={{
            backgroundColor: '#333',
            borderColor: '#333',
            color: 'white',
            fontWeight: 500,
          }}
        >
          Create a Listing
        </Button>
      </div>
      
      <Tabs 
        defaultActiveKey="all-listings" 
        items={items}
        size="large"
        style={{ 
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '16px'
        }}
      />
    </div>
  );
}