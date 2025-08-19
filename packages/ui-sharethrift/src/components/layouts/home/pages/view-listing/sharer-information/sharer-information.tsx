import { MessageSharerButton } from "@sthrift/ui-sharethrift-components";

export interface SharerInformationProps {
  owner: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    reviewCount: number;
  };
  listingId: string;
  isOwner?: boolean;
  sharedTimeAgo?: string;
  className?: string;
}

export function SharerInformation({ 
  owner, 
  listingId, 
  isOwner = false,
  sharedTimeAgo = "2 days ago",
  className = '' 
}: SharerInformationProps) {
  return (
    <div className={`flex items-center justify-between p-4 bg-gray-50 rounded-lg ${className}`}>
      <div className="flex items-center space-x-4">
        {/* Profile Image */}
        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
          {owner.avatar ? (
            <img 
              src={owner.avatar} 
              alt={`${owner.name}'s profile`}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-600 font-medium">
              {owner.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Owner Info */}
        <div>
          <h3 className="font-semibold text-gray-900">{owner.name}</h3>
          <p className="text-sm text-gray-600">shared {sharedTimeAgo}</p>
          
          {/* Rating */}
          <div className="flex items-center space-x-1 mt-1">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className={`w-4 h-4 fill-current ${i < Math.floor(owner.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {owner.rating} ({owner.reviewCount} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Message Button - Only show if not the owner */}
      {!isOwner && (
        <div className="hidden md:block">
          <MessageSharerButton 
            listingId={listingId}
            sharerId={owner.id}
            className="bg-blue-600 hover:bg-blue-700"
          />
        </div>
      )}

      {/* Mobile Message Button */}
      {!isOwner && (
        <div className="md:hidden">
          <MessageSharerButton 
            listingId={listingId}
            sharerId={owner.id}
            className="p-2 bg-blue-600 hover:bg-blue-700"
          />
        </div>
      )}
    </div>
  );
}