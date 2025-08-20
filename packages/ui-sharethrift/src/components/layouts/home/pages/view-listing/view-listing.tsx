import { Row, Col } from 'antd';
import './view-listing-responsive.css';
import { ListingImageGallery } from './listing-image-gallery';
import { SharerInformation } from './sharer-information';
import { ListingInformation } from './listing-information';
import type { ListingStatus, UserRole, ReservationRequestStatus } from './listing-information';

export interface ViewListingProps {
  listing: {
    id: string;
    title: string;
    itemName?: string;
    description: string;
    price?: number;
    priceUnit?: string;
    category: string;
    condition?: string;
    location: string;
    availableFrom: string;
    availableTo: string;
    status: ListingStatus;
    images: string[];
    owner: {
      id: string;
      name: string;
      avatar?: string;
      rating: number;
      reviewCount: number;
    };
  };
  userRole: UserRole;
  isAuthenticated: boolean;
  currentUserId?: string;
  reservationRequestStatus?: ReservationRequestStatus;
  sharedTimeAgo?: string;
}

export function ViewListing({ 
  listing, 
  userRole, 
  isAuthenticated, 
  currentUserId,
  reservationRequestStatus,
  sharedTimeAgo = '2 days ago' 
}: ViewListingProps) {

  const handleReserveClick = () => {
    if (!isAuthenticated) {
      // TODO: Show login or redirect to login page
    } else {
      // TODO: Handle reservation request logic
      console.log('Creating reservation request for listing:', listing.id);
    }
  };

  const handleLoginClick = () => {
    // TODO: Navigate to login page or trigger login flow
    console.log('Navigating to login...');
  };

  const handleSignUpClick = () => {
    // TODO: Navigate to signup page or trigger signup flow
    console.log('Navigating to signup...');
  };

  const isOwner = userRole === 'sharer' || Boolean(currentUserId && currentUserId === listing.owner.id);

  return (
    <>
      <Row
        style={{ minHeight: '100vh', paddingLeft: 125, paddingRight: 125, paddingTop: 72, paddingBottom: 72, boxSizing: 'border-box', width: '100%' }}
        gutter={[0, 12]}
        className="view-listing-responsive"
      >
        <Col span={24} style={{ marginBottom: 0, paddingBottom: 0 }}>
          {/* Sharer Info at top */}
          <SharerInformation
            sharer={listing.owner}
            listingId={listing.id}
            isOwner={isOwner}
            sharedTimeAgo={sharedTimeAgo}
            className="sharer-info-responsive"
          />
        </Col>
        <Col span={24} style={{ marginTop: 0, paddingTop: 0 }}>
          {/* Main content: 2 columns on desktop, stacked on mobile */}
          <Row gutter={36} align="top" style={{ marginTop: 0, paddingTop: 0 }} className="listing-main-responsive">
            {/* Left: Images */}
            <Col xs={24} md={12} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', marginTop: 0, paddingTop: 0 }}>
              <ListingImageGallery title={listing.title} className="listing-gallery-responsive" />
            </Col>
            {/* Right: Info/Form */}
            <Col xs={24} md={12} style={{ marginTop: 0, paddingTop: 0 }}>
              <ListingInformation
                listing={listing}
                userRole={userRole}
                isAuthenticated={isAuthenticated}
                reservationRequestStatus={reservationRequestStatus}
                onReserveClick={handleReserveClick}
                onLoginClick={handleLoginClick}
                onSignUpClick={handleSignUpClick}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      {/*
      <Modal
        open={showLoginModal}
        onCancel={() => setShowLoginModal(false)}
        footer={null}
        centered
      >
        <Row justify="center" align="middle" style={{ padding: 24 }}>
          <Col span={24} style={{ textAlign: 'center' }}>
            <h2 className="text-lg font-semibold">Sign in to reserve this listing</h2>
          </Col>
          <Col span={24} style={{ marginBottom: 8 }}>
            <Button type="primary" block onClick={handleLoginClick}>Login</Button>
          </Col>
          <Col span={24}>
            <Button block onClick={handleSignUpClick}>Sign Up</Button>
          </Col>
        </Row>
      </Modal>
      */}
    </>
  );
}