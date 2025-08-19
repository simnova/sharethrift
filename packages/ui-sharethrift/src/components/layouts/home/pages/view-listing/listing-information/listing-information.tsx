import { Tag } from 'antd';

export type ListingStatus = 'Active' | 'Paused' | 'Blocked' | 'Cancelled' | 'Expired';
export type UserRole = 'logged-out' | 'sharer' | 'reserver';
export type ReservationRequestStatus = 'pending' | 'accepted' | 'rejected' | 'closing' | 'closed';

export interface ListingInformationProps {
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
  };
  userRole: UserRole;
  isAuthenticated: boolean;
  reservationRequestStatus?: ReservationRequestStatus;
  onReserveClick?: () => void;
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
  className?: string;
}

export function ListingInformation({ 
  listing, 
  userRole, 
  isAuthenticated,
  reservationRequestStatus,
  onReserveClick,
  onLoginClick,
  onSignUpClick,
  className = '' 
}: ListingInformationProps) {
  
  const getStatusTagProps = (status: ListingStatus) => {
    switch (status) {
      case 'Active':
        return { className: 'activeTag', children: 'Active' };
      case 'Paused':
        return { className: 'pendingTag', children: 'Paused' };
      case 'Blocked':
        return { className: 'blockedTag', children: 'Blocked' };
      case 'Cancelled':
        return { className: 'blockedTag', children: 'Cancelled' };
      case 'Expired':
        return { className: 'expiredTag', children: 'Expired' };
      default:
        return { className: 'pendingTag', children: status };
    }
  };

  const getReservationStatusTagProps = (status: ReservationRequestStatus) => {
    switch (status) {
      case 'pending':
        return { className: 'pendingTag', children: 'Request Pending' };
      case 'accepted':
        return { className: 'requestAcceptedTag', children: 'Request Accepted' };
      case 'rejected':
        return { className: 'requestRejectedTag', children: 'Request Rejected' };
      case 'closing':
        return { className: 'closingTag', children: 'Closing' };
      case 'closed':
        return { className: 'expiredTag', children: 'Closed' };
      default:
        return { className: 'pendingTag', children: status };
    }
  };

  const renderActionButtons = () => {
    if (userRole === 'sharer') {
      return (
        <div className="space-y-3">
          <button className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
            Edit Listing
          </button>
          {listing.status === 'Active' && (
            <button className="w-full bg-yellow-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-yellow-700 transition-colors">
              Pause Listing
            </button>
          )}
          {listing.status === 'Paused' && (
            <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Activate Listing
            </button>
          )}
        </div>
      );
    }

    if (userRole === 'reserver' && isAuthenticated) {
      if (listing.status !== 'Active') {
        return (
          <div className="space-y-3">
            <button 
              disabled 
              className="w-full bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold cursor-not-allowed"
            >
              Listing Not Available
            </button>
          </div>
        );
      }

      return (
        <div className="space-y-3">
          <button 
            onClick={onReserveClick}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Request to Borrow
          </button>
        </div>
      );
    }

    // Logged out user
    if (listing.status !== 'Active') {
      return (
        <div className="space-y-3">
          <button 
            disabled 
            className="w-full bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold cursor-not-allowed"
          >
            Listing Not Available
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <button 
          onClick={onReserveClick}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Request to Borrow
        </button>
        <div className="text-center text-sm text-gray-600">
          <button 
            onClick={onLoginClick}
            className="text-blue-600 hover:text-blue-700 underline mr-2"
          >
            Login
          </button>
          or
          <button 
            onClick={onSignUpClick}
            className="text-blue-600 hover:text-blue-700 underline ml-2"
          >
            Sign up
          </button>
          to reserve this item
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Title and Status Tags */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {userRole === 'sharer' && (
            <Tag {...getStatusTagProps(listing.status)} />
          )}
          {userRole === 'reserver' && reservationRequestStatus && (
            <Tag {...getReservationStatusTagProps(reservationRequestStatus)} />
          )}
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
        
        {listing.itemName && (
          <p className="text-lg text-gray-700 mb-2">Item: {listing.itemName}</p>
        )}
        
        {listing.price && (
          <p className="text-2xl font-semibold text-blue-600">
            ${listing.price} <span className="text-lg text-gray-600">{listing.priceUnit}</span>
          </p>
        )}
      </div>

      {/* Listing Metadata */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Category:</span>
          <span className="font-medium">{listing.category}</span>
        </div>
        {listing.condition && (
          <div className="flex justify-between">
            <span className="text-gray-600">Condition:</span>
            <span className="font-medium">{listing.condition}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-600">Location:</span>
          <span className="font-medium">{listing.location}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Available:</span>
          <span className="font-medium">{listing.availableFrom} - {listing.availableTo}</span>
        </div>
      </div>

      {/* Action Buttons */}
      {renderActionButtons()}
    </div>
  );
}