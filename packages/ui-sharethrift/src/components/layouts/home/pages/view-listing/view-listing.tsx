import { useState } from 'react';
import { Modal, Button } from 'antd';
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
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleReserveClick = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    } else {
      // TODO: Handle reservation request logic
      console.log('Creating reservation request for listing:', listing.id);
    }
  };

  const handleLoginClick = () => {
    setShowLoginModal(false);
    // TODO: Navigate to login page or trigger login flow
    console.log('Navigating to login...');
  };

  const handleSignUpClick = () => {
    setShowLoginModal(false);
    // TODO: Navigate to signup page or trigger signup flow
    console.log('Navigating to signup...');
  };

  const isOwner = userRole === 'sharer' || Boolean(currentUserId && currentUserId === listing.owner.id);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <nav className="text-sm text-gray-500 mb-2">
          <span>Home</span> &gt; <span>Listings</span> &gt; <span className="text-gray-900">{listing.title}</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <ListingImageGallery 
          images={listing.images}
          title={listing.title}
        />

        {/* Listing Details */}
        <div className="space-y-6">
          <ListingInformation
            listing={listing}
            userRole={userRole}
            isAuthenticated={isAuthenticated}
            reservationRequestStatus={reservationRequestStatus}
            onReserveClick={handleReserveClick}
            onLoginClick={handleLoginClick}
            onSignUpClick={handleSignUpClick}
          />
        </div>
      </div>

      {/* Sharer Information */}
      <div className="mt-8">
        <SharerInformation
          owner={listing.owner}
          listingId={listing.id}
          isOwner={isOwner}
          sharedTimeAgo={sharedTimeAgo}
        />
      </div>

      {/* Description */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
        <p className="text-gray-700 leading-relaxed">{listing.description}</p>
      </div>

      {/* Login/Signup Modal */}
      <Modal
        title="Login Required"
        open={showLoginModal}
        onCancel={() => setShowLoginModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowLoginModal(false)}>
            Cancel
          </Button>,
          <Button key="login" onClick={handleLoginClick}>
            Login
          </Button>,
          <Button key="signup" type="primary" onClick={handleSignUpClick}>
            Sign Up
          </Button>,
        ]}
      >
        <p>You need to be logged in to request a reservation for this item.</p>
        <p className="mt-2">Would you like to login to your existing account or create a new one?</p>
      </Modal>
    </div>
  );
}