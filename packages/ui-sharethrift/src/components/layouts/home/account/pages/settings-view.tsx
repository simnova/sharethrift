import React from 'react';
import { Card, Button, Avatar, Typography, Row, Col, Divider, Space, Tag } from 'antd';
import { EditOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import type { SettingsViewProps, PlanOption } from './settings-view.types';
import styles from './settings-view.module.css';

const { Title, Text } = Typography;

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
        <Title level={4}>Profile Information</Title>
        <Button 
          type="text" 
          icon={<EditOutlined />} 
          onClick={() => handleEdit('profile')}
          className={styles.editButton}
        >
          Edit
        </Button>
      </div>
      
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={6} className={styles.profileImageCol}>
          <Avatar size={100} icon={<UserOutlined />} className={styles.profileAvatar} />
        </Col>
        <Col xs={24} sm={18}>
          <Space direction="vertical" size="small" className={styles.profileInfo}>
            <div>
              <Text type="secondary">First Name</Text>
              <br />
              <Text strong>{user.firstName || 'Not provided'}</Text>
            </div>
            <div>
              <Text type="secondary">Last Name</Text>
              <br />
              <Text strong>{user.lastName || 'Not provided'}</Text>
            </div>
            <div>
              <Text type="secondary">Username</Text>
              <br />
              <Text strong>{user.username}</Text>
            </div>
            <div>
              <Text type="secondary">Email</Text>
              <br />
              <Text strong>{user.email}</Text>
            </div>
          </Space>
        </Col>
      </Row>
    </Card>
  );

  const renderLocationSection = () => (
    <Card className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <Title level={4}>Location</Title>
        <Button 
          type="text" 
          icon={<EditOutlined />} 
          onClick={() => handleEdit('location')}
          className={styles.editButton}
        >
          Edit
        </Button>
      </div>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <div>
            <Text type="secondary">Address Line 1</Text>
            <br />
            <Text strong>{user.location.address1 || 'Not provided'}</Text>
          </div>
        </Col>
        <Col xs={24} sm={12}>
          <div>
            <Text type="secondary">Address Line 2</Text>
            <br />
            <Text strong>{user.location.address2 || 'Not provided'}</Text>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div>
            <Text type="secondary">City</Text>
            <br />
            <Text strong>{user.location.city || 'Not provided'}</Text>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div>
            <Text type="secondary">State</Text>
            <br />
            <Text strong>{user.location.state || 'Not provided'}</Text>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div>
            <Text type="secondary">Country</Text>
            <br />
            <Text strong>{user.location.country || 'Not provided'}</Text>
          </div>
        </Col>
        <Col xs={24} sm={12}>
          <div>
            <Text type="secondary">Zip Code</Text>
            <br />
            <Text strong>{user.location.zipCode || 'Not provided'}</Text>
          </div>
        </Col>
      </Row>
    </Card>
  );

  const renderPlanSection = () => (
    <Card className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <Title level={4}>Plan</Title>
        <Button 
          type="text" 
          icon={<EditOutlined />} 
          onClick={() => handleEdit('plan')}
          className={styles.editButton}
        >
          Edit Plan
        </Button>
      </div>
      
      <Row gutter={[16, 16]}>
        {PLAN_OPTIONS.map((plan) => (
          <Col xs={24} lg={8} key={plan.id}>
            <Card 
              className={`${styles.planCard} ${plan.isSelected ? styles.selectedPlan : ''}`}
              bodyStyle={{ padding: '20px' }}
            >
              <div className={styles.planHeader}>
                <Title level={5} className={styles.planName}>{plan.name}</Title>
                {plan.isPopular && <Tag color="blue">Popular</Tag>}
              </div>
              <Text strong className={styles.planPrice}>{plan.price}</Text>
              <ul className={styles.planFeatures}>
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              {plan.isSelected && (
                <Tag color="green" className={styles.selectedTag}>Current Plan</Tag>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );

  const renderBillingSection = () => (
    <Card className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <Title level={4}>Billing Information</Title>
        <Button 
          type="text" 
          icon={<EditOutlined />} 
          onClick={() => handleEdit('billing')}
          className={styles.editButton}
        >
          Edit
        </Button>
      </div>
      
      <Space direction="vertical" size="large" className={styles.billingInfo}>
        <div>
          <Text type="secondary">Payment Method</Text>
          <br />
          <Text strong>No payment method on file</Text>
        </div>
        <div>
          <Text type="secondary">Billing Address</Text>
          <br />
          <Text strong>Same as profile address</Text>
        </div>
        {user.billing?.subscriptionId && (
          <div>
            <Text type="secondary">Subscription ID</Text>
            <br />
            <Text strong>{user.billing.subscriptionId}</Text>
          </div>
        )}
      </Space>
    </Card>
  );

  const renderPasswordSection = () => (
    <Card className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <Title level={4}>Change Password</Title>
      </div>
      
      <Space direction="vertical" size="middle">
        <Text type="secondary">
          Click the button below to change your password. You will be redirected to a secure password change form.
        </Text>
        <Button 
          type="primary"
          icon={<LockOutlined />}
          onClick={onChangePassword}
          className={styles.changePasswordButton}
        >
          Change Password
        </Button>
      </Space>
    </Card>
  );

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.settingsHeader}>
        <Title level={2}>Account Settings</Title>
        <Text type="secondary">Manage your account information and preferences</Text>
      </div>
      
      <Divider />
      
      <Space direction="vertical" size="large" className={styles.sectionsContainer}>
        {renderProfileSection()}
        {renderLocationSection()}
        {renderPlanSection()}
        {renderBillingSection()}
        {renderPasswordSection()}
      </Space>
    </div>
  );
};