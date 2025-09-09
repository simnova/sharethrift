import { Card, Avatar, Button, Tag, Typography, Row, Col, Space, Divider } from 'antd';
import { ListingsGrid } from '@sthrift/ui-sharethrift-components';
import { SettingOutlined, UserOutlined } from '@ant-design/icons';
import './profile-view.overrides.css';

const { Text } = Typography;

interface UserProfileData {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  accountType: string;
  location: {
    city: string;
    state: string;
  };
  createdAt: string;
}

interface UserListing {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  state: string;
  images: string[];
  createdAt: string;
  sharingPeriodStart: string;
  sharingPeriodEnd: string;
}

interface ProfileViewProps {
  user: UserProfileData;
  listings: UserListing[];
  isOwnProfile: boolean;
  onEditSettings: () => void;
  onListingClick: (listingId: string) => void;
}

export function ProfileView({ 
  user, 
  listings, 
  isOwnProfile, 
  onEditSettings, 
  onListingClick 
}: Readonly<ProfileViewProps>) {


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Profile Header */}
      <Card className="mb-6 profile-header">
        {/* Mobile Account Settings Button */}
        {isOwnProfile && (
          <div className="profile-settings-mobile">
            <Button
              type="primary"
              icon={<SettingOutlined />}
              onClick={onEditSettings}
              className="profile-settings-mobile-btn"
            >
              Account Settings
            </Button>
          </div>
        )}
        <Row gutter={24} align="middle">
          <Col xs={24} sm={6} lg={4} className="text-center mb-4 sm:mb-0">
            <Avatar
              className="mb-4 profile-avatar-scale"
            />
          </Col>
          <Col xs={24} sm={18} lg={20}>
            <div className="nameSect profile-info-center">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div className="title42">{user.firstName} {user.lastName.charAt(0)}.</div>
                {/* Desktop Account Settings Button */}
                {isOwnProfile && (
                  <div className="profile-settings-desktop">
                    <Button
                      type="primary"
                      icon={<SettingOutlined />}
                      onClick={onEditSettings}
                      className="profile-settings-desktop-btn"
                    >
                      Account Settings
                    </Button>
                  </div>
                )}
              </div>
              <h3 className="block mb-2">
                @{user.username}
              </h3>
            </div>
            <div className="profile-info-center">
              <Space className="mb-3" wrap>
                <Tag className="personalAccount">
                    <UserOutlined style={{ color: 'var(--color-background)', fontSize: 16 }}/>
                    {user.accountType.charAt(0).toUpperCase() + user.accountType.slice(1)}
                </Tag>
                <span>|</span>
                <p>{user.location.city}, {user.location.state}</p>
                <span>|</span>
                <p>Sharing since {formatDate(user.createdAt)}</p>
              </Space>
              
            </div>
          </Col>
        </Row>
      </Card>

      <Divider orientation="left">
        <h2 style={{ color: 'var(--color-tertiary)' }}>My Listings</h2>
      </Divider>

      {/* User Listings */}
      <div className="profile-listings-grid-override" style={{ marginTop: '1rem', marginBottom: '2rem', marginLeft: '3rem', marginRight: '3rem' }}>
        <ListingsGrid
          listings={listings.map(l => ({
            ...l,
            _id: l.id,
            sharer: user.username,
            sharingPeriodStart: new Date(l.sharingPeriodStart),
            sharingPeriodEnd: new Date(l.sharingPeriodEnd),
            state: (
              [
                'Published', 'Paused', 'Cancelled', 'Drafted', 'Expired', 'Blocked', 'Appeal Requested'
              ].includes(l.state)
                ? l.state as (
                  | 'Published'
                  | 'Paused'
                  | 'Cancelled'
                  | 'Drafted'
                  | 'Expired'
                  | 'Blocked'
                  | 'Appeal Requested'
                  | undefined
                )
                : undefined
            ),
            createdAt: l.createdAt ? new Date(l.createdAt) : undefined,
          }))}
          onListingClick={listing => onListingClick(listing._id)}
          currentPage={1}
          pageSize={20}
          total={listings.length}
          onPageChange={() => {}}
          showPagination={false}
        />
        {listings.length === 0 && (
          <Card>
            <div className="text-center py-8">
              <Text type="secondary">No listings yet</Text>
              {isOwnProfile && (
                <div className="mt-4">
                  <Button type="primary">Create Your First Listing</Button>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}