import { useState } from 'react';
import { Button, Card, Tabs } from 'antd';
import type { TabsProps } from 'antd';

type PersonalAccountSubType = 'non-verified' | 'verified' | 'verified-plus';
type BusinessAccountSubType = 'business' | 'business-plus';

interface AccountOption {
  id: string;
  title: string;
  price: string;
  features: string[];
  icon?: string;
}

const personalOptions: AccountOption[] = [
  {
    id: 'non-verified',
    title: 'Non-Verified Personal',
    price: '$0/month',
    features: [
      '5 active reservations',
      '3 bookmarks',
      '15 items to share',
      '5 friends'
    ],
    icon: '🪑' // Using emoji for now, can be replaced with proper icons
  },
  {
    id: 'verified',
    title: 'Verified Personal',
    price: '$0/month',
    features: [
      '10 active reservations',
      '10 bookmarks',
      '30 items to share',
      '10 friends'
    ],
    icon: '🛋️'
  },
  {
    id: 'verified-plus',
    title: 'Verified Personal Plus',
    price: '$4.99/month',
    features: [
      '30 active reservations',
      '30 bookmarks',
      '50 items to share',
      '30 friends'
    ],
    icon: '💺'
  }
];

const businessOptions: AccountOption[] = [
  {
    id: 'business',
    title: 'Business',
    price: '$14.99/month',
    features: [
      '200 items for lease',
      '50 friends',
      '4 owner class listings',
      '1 free legal case can show (first 60+15 if manage)',
      'Help Required reports'
    ],
    icon: '🛒'
  },
  {
    id: 'business-plus',
    title: 'Business Plus',
    price: '$24.99/month',
    features: [
      '1000 items for lease',
      '100 friends',
      '20 active class listings',
      '20 free legal cases can show closed listings (6 if manage)',
      'Advanced business reports'
    ],
    icon: '🛍️'
  }
];

export default function SelectAccountType() {
  const [selectedPersonalType, setSelectedPersonalType] = useState<PersonalAccountSubType>('verified');
  const [selectedBusinessType, setSelectedBusinessType] = useState<BusinessAccountSubType>('business-plus');

  const renderAccountCard = (option: AccountOption, isSelected: boolean, onSelect: () => void) => (
    <Card
      key={option.id}
      className={`cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'shadow-lg' 
          : 'hover:shadow-md'
      }`}
      style={{ 
        width: 280, 
        height: 320,
        position: 'relative',
        border: isSelected ? '2px solid var(--color-secondary)' : '1px solid var(--color-foreground-2)',
        borderRadius: '12px',
        overflow: 'hidden'
      }}
      styles={{
        body: { 
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          height: '100%',
          position: 'relative'
        }
      }}
      onClick={onSelect}
    >
      {isSelected && (
        <div 
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: 'var(--color-secondary)',
            borderRadius: '50%',
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '14px',
            fontWeight: 'bold',
            zIndex: 1
          }}
        >
          ✓
        </div>
      )}
      
      <div style={{ fontSize: '60px', marginBottom: '20px' }}>
        {option.icon}
      </div>
      
      <h3 style={{ 
        fontSize: '18px', 
        fontWeight: 600, 
        marginBottom: '12px',
        minHeight: '48px',
        display: 'flex',
        alignItems: 'center',
        color: 'var(--color-message-text)',
        textAlign: 'center'
      }}>
        {option.title}
      </h3>
      
      <div style={{ 
        fontSize: '20px', 
        fontWeight: 'bold', 
        color: 'var(--color-secondary)',
        marginBottom: '20px'
      }}>
        {option.price}
      </div>
      
      <div style={{ 
        textAlign: 'left', 
        fontSize: '13px',
        lineHeight: '1.5',
        flex: 1,
        color: 'var(--color-message-text)'
      }}>
        {option.features.map((feature, index) => (
          <div key={index} style={{ marginBottom: '6px' }}>
            • {feature}
          </div>
        ))}
      </div>
    </Card>
  );

  const personalTabContent = (
    <div style={{ padding: '24px 0' }}>
      <div style={{ 
        display: 'flex', 
        gap: '24px', 
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        {personalOptions.map((option) => 
          renderAccountCard(
            option,
            selectedPersonalType === option.id,
            () => setSelectedPersonalType(option.id as PersonalAccountSubType)
          )
        )}
      </div>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '16px', 
        marginTop: '32px' 
      }}>
        {selectedPersonalType === 'verified' || selectedPersonalType === 'verified-plus' ? (
          <Button type="primary" size="large">
            Start Identity Verification
          </Button>
        ) : null}
        <Button type="default" size="large">
          Save and Continue
        </Button>
      </div>
    </div>
  );

  const businessTabContent = (
    <div style={{ padding: '24px 0' }}>
      <div style={{ 
        display: 'flex', 
        gap: '24px', 
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        {businessOptions.map((option) => 
          renderAccountCard(
            option,
            selectedBusinessType === option.id,
            () => setSelectedBusinessType(option.id as BusinessAccountSubType)
          )
        )}
      </div>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '16px', 
        marginTop: '32px' 
      }}>
        <Button type="primary" size="large">
          Start Identity Verification
        </Button>
        <Button type="default" size="large">
          Save and Continue
        </Button>
      </div>
    </div>
  );

  const enterpriseTabContent = (
    <div style={{ 
      padding: '48px 24px',
      textAlign: 'center',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <p style={{ 
        fontSize: '16px',
        lineHeight: '1.6',
        color: 'var(--color-message-text)',
        marginBottom: '24px'
      }}>
        ShareThrift offers enterprise accounts to businesses for your company account
        type integration. Please contact us if you need support for an enterprise
        account in the right fit for you.
      </p>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '16px'
      }}>
        <Button type="primary" size="large">
          Contact Us
        </Button>
        <Button type="default" size="large">
          Save and Continue
        </Button>
      </div>
    </div>
  );

  const tabItems: TabsProps['items'] = [
    {
      key: 'personal',
      label: 'Personal Account',
      children: personalTabContent,
    },
    {
      key: 'business',
      label: 'Business Account',
      children: businessTabContent,
    },
    {
      key: 'enterprise',
      label: 'Enterprise Account',
      children: enterpriseTabContent,
    },
  ];

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '24px',
      minHeight: '100vh'
    }}>
      <h1 className="title36" style={{ 
        textAlign: 'center', 
        marginBottom: '32px',
        color: 'var(--color-message-text)'
      }}>
        Account Type and Plan
      </h1>
      
      <Tabs
        defaultActiveKey="personal"
        items={tabItems}
        centered
        size="large"
      />
    </div>
  );
}
