import { Card, Avatar, Button, List, Tag, Typography, Row, Col, Space, Divider } from 'antd';
import { UserOutlined, EditOutlined, CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

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
}: ProfileViewProps) {
  const getStateColor = (state: string) => {
    switch (state) {
      case 'Published': return 'green';
      case 'Drafted': return 'orange';
      case 'Paused': return 'blue';
      case 'Expired': return 'red';
      case 'Blocked': return 'red';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Profile Header */}
      <Card className="mb-6">
        <Row gutter={24} align="middle">
          <Col xs={24} sm={6} className="text-center mb-4 sm:mb-0">
            <Avatar
              size={120}
              icon={<UserOutlined />}
              className="mb-4"
            />
          </Col>
          <Col xs={24} sm={18}>
            <div>
              <Title level={2} className="mb-1">
                {user.firstName} {user.lastName.charAt(0)}.
              </Title>
              <Text type="secondary" className="block mb-2">
                @{user.username}
              </Text>
              <Space className="mb-3" wrap>
                <Tag color="blue">{user.accountType}</Tag>
                <Tag icon={<EnvironmentOutlined />}>
                  {user.location.city}, {user.location.state}
                </Tag>
                <Tag icon={<CalendarOutlined />}>
                  Member since {formatDate(user.createdAt)}
                </Tag>
              </Space>
              {isOwnProfile && (
                <div>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={onEditSettings}
                  >
                    Edit Account Settings
                  </Button>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Card>

      <Divider orientation="left">
        <Title level={3}>My Listings ({listings.length})</Title>
      </Divider>

      {/* User Listings */}
      {listings.length === 0 ? (
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
      ) : (
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 2,
            lg: 3,
            xl: 3,
          }}
          dataSource={listings}
          renderItem={(listing) => (
            <List.Item>
              <Card
                hoverable
                cover={
                  listing.images.length > 0 ? (
                    <img
                      alt={listing.title}
                      src={listing.images[0]}
                      className="h-48 object-cover"
                    />
                  ) : (
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      <Text type="secondary">No Image</Text>
                    </div>
                  )
                }
                onClick={() => onListingClick(listing.id)}
                className="h-full"
              >
                <Card.Meta
                  title={
                    <div className="flex justify-between items-start">
                      <Text className="text-base font-medium" ellipsis>
                        {listing.title}
                      </Text>
                      <Tag color={getStateColor(listing.state)} className="ml-2">
                        {listing.state}
                      </Tag>
                    </div>
                  }
                  description={
                    <div>
                      <Paragraph
                        ellipsis={{ rows: 2 }}
                        className="text-sm mb-2"
                      >
                        {listing.description}
                      </Paragraph>
                      <div className="text-xs text-gray-500">
                        <div>{listing.category}</div>
                        <div className="flex items-center mt-1">
                          <EnvironmentOutlined className="mr-1" />
                          {listing.location}
                        </div>
                        <div className="mt-1">
                          Created {formatDate(listing.createdAt)}
                        </div>
                      </div>
                    </div>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
}