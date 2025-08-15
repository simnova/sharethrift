import { useParams } from 'react-router-dom';
import { MessageSharerButton } from "@sthrift/ui-sharethrift-components";


export default function ViewListing() {
  const { listingId } = useParams<{ listingId: string }>();
  
  // Mock listing data - in a real app this would come from a GraphQL query
  const listing = {
    id: listingId || 'listing123',
    title: 'City Bike',
    description: 'A great bike for city commuting. Well maintained and ready to ride!',
    price: 25,
    priceUnit: 'per day',
    location: 'Downtown Seattle',
    images: ['/api/placeholder/400/300'],
    owner: {
      id: 'owner456',
      name: 'Patrick G.',
      avatar: '/api/placeholder/50/50',
      rating: 4.8,
      reviewCount: 23
    },
    category: 'Transportation',
    condition: 'Excellent',
    availableFrom: '2024-07-04',
    availableTo: '2024-07-10'
  };

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
        <div>
          <div className="aspect-w-4 aspect-h-3 bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-full h-64 object-cover"
            />
          </div>
        </div>

        {/* Listing Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
            <p className="text-2xl font-semibold text-blue-600">
              ${listing.price} <span className="text-lg text-gray-600">{listing.priceUnit}</span>
            </p>
          </div>

          {/* Owner Info */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-medium">
                {listing.owner.name.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{listing.owner.name}</h3>
              <div className="flex items-center space-x-1">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {listing.owner.rating} ({listing.owner.reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Listing Info */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Category:</span>
              <span className="font-medium">{listing.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Condition:</span>
              <span className="font-medium">{listing.condition}</span>
            </div>
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
          <div className="space-y-3">
            <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Request to Borrow
            </button>
            
            <MessageSharerButton 
              listingId={listing.id}
              sharerId={listing.owner.id}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
        <p className="text-gray-700 leading-relaxed">{listing.description}</p>
      </div>
    </div>
  );
}
