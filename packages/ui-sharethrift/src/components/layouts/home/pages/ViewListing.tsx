import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Typography, Tag, Row, Col, Image, Descriptions, Avatar, Alert } from 'antd';
import { ArrowLeftOutlined, UserOutlined, EnvironmentOutlined, CalendarOutlined } from '@ant-design/icons';
import { mockListings } from '../../../../data/mockListings';
import { useAuth } from '../../../../contexts/AuthContext';

const { Title, Paragraph } = Typography;

export default function ViewListing() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const listing = mockListings.find(l => l._id === id);

  if (!listing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button 
          type="link" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          Back to Listings
        </Button>
        <Alert
          message="Listing Not Found"
          description="The listing you're looking for doesn't exist or has been removed."
          type="error"
          showIcon
        />
      </div>
    );
  }

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start).toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric' 
    });
    const endDate = new Date(end).toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric' 
    });
    return { startDate, endDate };
  };

  const { startDate, endDate } = formatDateRange(listing.sharingPeriodStart, listing.sharingPeriodEnd);

  const handleReserveClick = () => {
    if (!isAuthenticated) {
      // Prompt to log in
      navigate('/signup');
    } else {
      // Navigate to reservation flow
      navigate(`/create-reservation/${listing._id}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Back Button */}
      <Button 
        type="link" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        Back to Listings
      </Button>

      <Row gutter={[32, 32]}>
        {/* Image Section */}
        <Col xs={24} lg={14}>
          <Card className="h-full">
            <Image
              src={listing.image}
              alt={listing.title}
              className="w-full rounded-lg"
              style={{ maxHeight: '500px', objectFit: 'cover' }}
              fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=="
            />
          </Card>
        </Col>

        {/* Details Section */}
        <Col xs={24} lg={10}>
          <div className="space-y-6">
            {/* Title and Category */}
            <div>
              <Title level={1} className="mb-2">
                {listing.title}
              </Title>
              <Tag color="blue" className="mb-4">
                {listing.category}
              </Tag>
            </div>

            {/* Description */}
            <div>
              <Title level={4}>Description</Title>
              <Paragraph className="text-gray-600">
                {listing.description}
              </Paragraph>
            </div>

            {/* Details */}
            <Descriptions column={1} size="middle">
              <Descriptions.Item 
                label={<span><EnvironmentOutlined className="mr-2" />Location</span>}
              >
                {listing.location}
              </Descriptions.Item>
              
              <Descriptions.Item 
                label={<span><CalendarOutlined className="mr-2" />Available From</span>}
              >
                {startDate}
              </Descriptions.Item>
              
              <Descriptions.Item 
                label={<span><CalendarOutlined className="mr-2" />Available Until</span>}
              >
                {endDate}
              </Descriptions.Item>
              
              <Descriptions.Item 
                label={<span><UserOutlined className="mr-2" />Shared By</span>}
              >
                <div className="flex items-center">
                  <Avatar icon={<UserOutlined />} className="mr-2" />
                  {listing.sharer.firstName} {listing.sharer.lastName.charAt(0)}.
                </div>
              </Descriptions.Item>
            </Descriptions>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                type="primary" 
                size="large" 
                block
                onClick={handleReserveClick}
              >
                {isAuthenticated ? 'Request to Borrow' : 'Log In to Borrow'}
              </Button>
              
              {!isAuthenticated && (
                <Alert
                  message="Please log in or sign up to request items"
                  type="info"
                  showIcon
                  className="mt-3"
                />
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
