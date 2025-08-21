import { Row, Col } from 'antd';
import ListingImageGalleryContainer from './listing-image-gallery/listing-image-gallery.container';
import SharerInformationContainer from './sharer-information/sharer-information.container';
import ListingInformationContainer from './listing-information/listing-information.container';
import type { UserRole, ReservationRequestStatus } from './listing-information/listing-information';

import type { ItemListing } from '../../mock-listings';

export interface ViewListingProps {
  listing: ItemListing;
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
  reservationRequestStatus,
  sharedTimeAgo,
}: ViewListingProps) {
  // Mock sharer info (since ItemListing.sharer is just an ID)
  const sharer = {
    id: listing.sharer,
    name: listing.sharer,
    avatar: undefined,
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
          }
          .listing-gallery-responsive,
          .listing-info-responsive,
          .sharer-info-responsive {
            width: 100% !important;
            max-width: 450px !important;
            margin-left: auto !important;
            margin-right: auto !important;
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
        style={{ minHeight: '100vh', paddingLeft: 125, paddingRight: 125, paddingTop: 72, paddingBottom: 72, boxSizing: 'border-box', width: '100%' }}
        gutter={[0, 12]}
        className="view-listing-responsive"
      >
        <Col span={24} style={{ marginBottom: 0, paddingBottom: 0 }}>
          {/* Sharer Info at top */}
          <SharerInformationContainer
            sharer={sharer}
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
              <ListingImageGalleryContainer images={listing.images ?? []} title={listing.title} className="listing-gallery-responsive" />
            </Col>
            {/* Right: Info/Form */}
            <Col xs={24} md={12} style={{ marginTop: 0, paddingTop: 0 }}>
              <ListingInformationContainer
                listingId={listing._id}
                userRole={userRole}
                isAuthenticated={isAuthenticated}
                reservationRequestStatus={reservationRequestStatus}
                onReserveClick={undefined}
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