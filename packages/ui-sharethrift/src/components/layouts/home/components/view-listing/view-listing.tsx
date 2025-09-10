import { Row, Col, Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import ListingImageGalleryContainer from './listing-image-gallery/listing-image-gallery.container';
import SharerInformationContainer from './sharer-information/sharer-information.container';
import ListingInformationContainer from './listing-information/listing-information.container';
import type { ReservationRequestState } from '../../../../../generated';

import type { ItemListing } from '../mock-listings';

export interface ViewListingProps {
  listing: ItemListing;
  userRole: string;
  isAuthenticated: boolean;
  currentUserId?: string;
  reservationRequestStatus: ReservationRequestState | null;
  sharedTimeAgo?: string;
}

export function ViewListing({ 
  listing,
  userRole,
  isAuthenticated,
  reservationRequestStatus,
  sharedTimeAgo,
}: ViewListingProps) {
  // Mock sharer info (since ItemListing.sharer is just an ID)
  const sharerId = listing.sharer;
  const handleBack = () => {
    window.location.href = '/';
  };
  return (
    <>
      <style>{`

        @media (max-width: 600px) {
          .view-listing-responsive {
            padding-left: 16px !important;
            padding-right: 16px !important;
            padding-top: 24px !important;
            padding-bottom: 24px !important;
          }
          .listing-main-responsive {
            flex-direction: column !important;
            gap: 0 !important;
            align-items: center !important;
          }
          .sharer-info-responsive {
            align-items: center !important;
          }
          .listing-gallery-responsive,
          .listing-info-responsive,
          .sharer-info-responsive {
            width: 100% !important;
            max-width: 450px !important;
            margin-left: auto !important;
            margin-right: auto !important;
          }
          .listing-info-text-row,
          .sharer-info-text-row {
            width: 100% !important;
            text-align: left !important;
          }
          .listing-gallery-responsive {
            height: auto !important;
            margin-bottom: 8px !important;
          }
          .listing-info-responsive {
            margin-bottom: 16px !important;
          }
          .sharer-info-responsive {
            margin-bottom: 16px !important;
          }
        }
      `}</style>
      <Row
        style={{paddingLeft: 100, paddingRight: 100, paddingTop: 50, paddingBottom: 75, boxSizing: 'border-box', width: '100%' }}
        gutter={[0, 24]}
        className="view-listing-responsive"
      >
        <Col span={24} style={{ marginBottom: 0, paddingBottom: 0 }}>
        <Button
          className="primaryButton"
          icon={<LeftOutlined />}
          onClick={handleBack}
          type="primary"
          aria-label="Back"
        >
          Back
        </Button>
        </Col>
        <Col span={24} style={{ marginBottom: 0, paddingBottom: 0 }}>
          {/* Sharer Info at top */}
          <SharerInformationContainer
            sharerId={sharerId}
            listingId={listing._id}
            className="sharer-info-responsive"
            sharedTimeAgo={sharedTimeAgo}
          />
        </Col>
        <Col span={24} style={{ marginTop: 0, paddingTop: 0 }}>
          {/* Main content: 2 columns on desktop, stacked on mobile */}
          <Row gutter={36} align="top" style={{ marginTop: 0, paddingTop: 0 }} className="listing-main-responsive">
            {/* Left: Images */}
            <Col xs={24} md={12} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', marginTop: 0, paddingTop: 0 }}>
              <ListingImageGalleryContainer 
                listingId={listing._id}
                className="listing-gallery-responsive" 
              />
            </Col>
            {/* Right: Info/Form */}
            <Col xs={24} md={12} style={{ marginTop: 0, paddingTop: 0 }}>
              <ListingInformationContainer
                listingId={listing._id}
                userRole={userRole}
                isAuthenticated={isAuthenticated}
                reservationRequestStatus={reservationRequestStatus}
                className="listing-info-responsive"
              />
            </Col>
          </Row>
        </Col>
      </Row>
      {/* TODO: Add login modal here for unauthenticated users attempting to reserve a listing. */}
    </>
  );
}