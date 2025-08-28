import { Button, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { AllListingsTableContainer } from './all-listings-table.container';
import { RequestsTableContainer } from './requests-table.container';
import { MOCK_LISTING_REQUESTS } from '../mock-data';
import { useState } from 'react';

export interface MyListingsDashboardProps {
  onCreateListing: () => void;
}

export function MyListingsDashboard({ onCreateListing }: MyListingsDashboardProps) {
  const requestsCount = MOCK_LISTING_REQUESTS.length;
  const [activeTab, setActiveTab] = useState('all-listings');
  const [allListingsPage, setAllListingsPage] = useState(1);
  const [requestsPage, setRequestsPage] = useState(1);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    // Reset the page for the tab being switched to
    if (key === 'all-listings') setAllListingsPage(1);
    if (key === 'requests') setRequestsPage(1);
  };

  const items: TabsProps['items'] = [
    {
      key: 'all-listings',
      label: 'All Listings',
      children: <AllListingsTableContainer currentPage={allListingsPage} onPageChange={setAllListingsPage} />, 
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
          }}>{requestsCount}</span>
        </span>
      ),
      children: <RequestsTableContainer currentPage={requestsPage} onPageChange={setRequestsPage} />, 
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
        <h1 className="title42">
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
        activeKey={activeTab}
        onChange={handleTabChange}
        items={items}
        size="large"
        style={{ 
          padding: '16px'
        }}
      />
    </div>
  );
}