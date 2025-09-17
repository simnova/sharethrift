import React from 'react';
import { Card, Button, Avatar, Typography, Row, Col, Divider, Space, Tag } from 'antd';
import { EditOutlined, LockOutlined } from '@ant-design/icons';
import type { SettingsViewProps, PlanOption } from './settings-view.types';
import styles from './settings-view.module.css';
import '@sthrift/ui-sharethrift-components/src/styles/theme.css';

const { Text } = Typography;

// Mock plan data - this would come from API in real implementation
const PLAN_OPTIONS: PlanOption[] = [
  {
    id: 'non-verified',
    name: 'Non-Verified Personal',
    price: '$0/month',
    features: ['5 active reservations', '5 bookmarks', '15 items to share', '5 friends'],
    isSelected: false,
  },
  {
    id: 'verified',
    name: 'Verified Personal',
    price: '$0/month',
    features: ['10 active reservations', '10 bookmarks', '30 items to share', '10 friends'],
    isSelected: true,
    isPopular: true,
  },
  {
    id: 'verified-plus',
    name: 'Verified Personal Plus',
    price: '$4.99/month',
    features: ['30 active reservations', '30 bookmarks', '50 items to share', '30 friends'],
    isSelected: false,
  },
];

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onEditSection,
  onChangePassword,
}) => {
  const handleEdit = (section: string) => {
    onEditSection(section);
  };

  const renderProfileSection = () => (
    <Card className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <h2>Profile Information</h2>
        <Button 
          icon={<EditOutlined />} 
          onClick={() => handleEdit('profile')}
          type="primary"
        >
          Edit
        </Button>
      </div>
      
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={6} className={styles.profileImageCol}>
          <Avatar className={styles.profileAvatar} />
        </Col>
        <Col xs={24} sm={18}>
            <Row>
                <Col xs={24} sm={12}>
                    <div>
                    <Text className="label">First Name</Text>
                    <br />
                    <p>{user.firstName || 'Not provided'}</p>
                    </div>
                </Col>
                <Col xs={24} sm={12}>
                    <div>
                    <Text className="label">Last Name</Text>
                    <br />
                    <p>{user.lastName || 'Not provided'}</p>
                    </div>
                </Col>
                <Col xs={24} sm={12}>
                    <div>
                    <Text className="label">Username</Text>
                    <br />
                    <p>{user.username}</p>
                    </div>
                </Col>
                 <Col xs={24} sm={12}>
                    <div>
                    <Text className="label">Email</Text>
                    <br />
                    <p>{user.email}</p>
                    </div>
                </Col>
            </Row>
        </Col>
      </Row>
    </Card>
  );

  const renderLocationSection = () => (
    <Card className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <h2>Location</h2>
        <Button 
          icon={<EditOutlined />} 
          onClick={() => handleEdit('location')}
          type="primary"
        >
          Edit
        </Button>
      </div>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <div>
            <Text className="label">Address Line 1</Text>
            <br />
            <p>{user.location.address1 || 'Not provided'}</p>
          </div>
        </Col>
        <Col xs={24} sm={12}>
          <div>
            <Text className="label">Address Line 2</Text>
            <br />
            <p>{user.location.address2 || 'Not provided'}</p>
          </div>
        </Col>
        <Col xs={24} sm={6}>
          <div>
            <Text className="label">City</Text>
            <br />
            <p>{user.location.city || 'Not provided'}</p>
          </div>
        </Col>
        <Col xs={24} sm={6}>
          <div>
            <Text className="label">State</Text>
            <br />
            <p>{user.location.state || 'Not provided'}</p>
          </div>
        </Col>
        <Col xs={24} sm={6}>
          <div>
            <Text className="label">Country</Text>
            <br />
            <p>{user.location.country || 'Not provided'}</p>
          </div>
        </Col>
        <Col xs={24} sm={6}>
          <div>
            <Text className="label">Zip Code</Text>
            <br />
            <p>{user.location.zipCode || 'Not provided'}</p>
          </div>
        </Col>
      </Row>
    </Card>
  );

  // Plan icons to match SelectAccountType.tsx
  const planIcons: Record<string, string> = {
    'non-verified': '/assets/item-images/stool.png',
    'verified': '/assets/item-images/armchair.png',
    'verified-plus': '/assets/item-images/bubble-chair.png',
  };

  const renderPlanCard = (plan: PlanOption) => (
    <Card
      key={plan.id}
      className={`cursor-pointer transition-all duration-200 ${styles.planCard} ${plan.isSelected ? styles.selectedPlan : ''}`}
      style={{
        width: 280,
        position: 'relative',
        border: plan.isSelected
          ? '2px solid var(--color-secondary)'
          : '1px solid var(--color-foreground-2)',
        borderRadius: '12px',
        overflow: 'hidden',
        margin: '0 auto',
      }}
      bodyStyle={{
        padding: '10px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        height: '100%',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: 12 }}>
        <h3
          className="font-bold text-secondary"
          style={{
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--color-message-text)',
            textAlign: 'left',
            margin: 0,
            flex: 1,
            minHeight: '48px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {plan.name}
        </h3>
        {plan.isPopular && <Tag color="blue" style={{ marginLeft: 8 }}>Popular</Tag>}
        <div
          style={{
            marginLeft: 8,
            border: `1px solid ${plan.isSelected ? 'var(--color-secondary)' : 'grey'}`,
            backgroundColor: plan.isSelected ? 'var(--color-secondary)' : 'transparent',
            borderRadius: '50%',
            width: 18,
            height: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '14px',
            fontWeight: 'bold',
            zIndex: 1,
          }}
        >
          {plan.isSelected ? <span style={{ fontSize: 14 }}>✓</span> : null}
        </div>
      </div>

      <div
        style={{
          fontSize: '60px',
          marginBottom: '20px',
          height: 150,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={planIcons[plan.id]}
          alt={plan.name}
          style={{ height: 150, width: 'auto', objectFit: 'contain' }}
        />
      </div>

      <div
        className="font-bold text-secondary"
        style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: 'var(--color-secondary)',
          marginBottom: '20px',
        }}
      >
        {plan.price}
      </div>

      <div
        style={{
          textAlign: 'left',
          fontSize: '13px',
          lineHeight: '1.5',
          flex: 1,
          color: 'var(--color-message-text)',
        }}
      >
        {plan.features.map((feature) => (
          <div key={feature} style={{ marginBottom: '6px' }}>
            • {feature}
          </div>
        ))}
      </div>

      {plan.isSelected && (
        <Tag color="green" className={styles.selectedTag} style={{ marginTop: 12 }}>Current Plan</Tag>
      )}
    </Card>
  );

  const renderPlanSection = () => (
    <Card className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <h2>Plan</h2>
        <Button 
          icon={<EditOutlined />} 
          onClick={() => handleEdit('plan')}
          type="primary"
        >
          Edit
        </Button>
      </div>
      <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap', padding: '24px 0' }}>
        {PLAN_OPTIONS.map((plan) => renderPlanCard(plan))}
      </div>
    </Card>
  );

  const renderBillingSection = () => (
    <Card className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <h2>Billing</h2>
        <Button 
          icon={<EditOutlined />} 
          onClick={() => handleEdit('billing')}
          type="primary"
        >
          Edit
        </Button>
      </div>
      
      <Space direction="vertical" size="large" className={styles.billingInfo}>
        <div>
          <Text className="label">Payment Method</Text>
          <br />
          <p>No payment method on file</p>
        </div>
        <div>
          <Text className="label">Billing Address</Text>
          <br />
          <p>Same as profile address</p>
        </div>
        {user.billing?.subscriptionId && (
          <div>
            <Text className="label">Subscription ID</Text>
            <br />
            <p>{user.billing.subscriptionId}</p>
          </div>
        )}
      </Space>
    </Card>
  );

  const renderPasswordSection = () => (
    <Card className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <h2>Change Password</h2>
      </div>
      
      <Space direction="vertical" size="middle">
        <Text className="label">
          Click the button below to change your password. You will be redirected to a secure password change form.
        </Text>
        <Button 
          type="primary"
          icon={<LockOutlined />}
          onClick={onChangePassword}
        >
          Change Password
        </Button>
      </Space>
    </Card>
  );

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.settingsHeader}>
        <h1 className="title42">Account Settings</h1>
      </div>
      
      <Divider />
      
      <Space direction="vertical" size="large" className={styles.sectionsContainer}>
        {renderProfileSection()}
        <Divider />
        {renderLocationSection()}
        <Divider />
        {renderPlanSection()}
        <Divider />
        {renderBillingSection()}
        <Divider />
        {renderPasswordSection()}
      </Space>
    </div>
  );
};