import { useState } from 'react';

export interface ListingImageGalleryProps {
  images: string[];
  title: string;
  className?: string;
}

export function ListingImageGallery({ images, title, className = '' }: ListingImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  if (!images || images.length === 0) {
    return (
      <div className={`aspect-w-4 aspect-h-3 bg-gray-200 rounded-lg overflow-hidden ${className}`}>
        <div className="w-full h-64 flex items-center justify-center">
          <span className="text-gray-500">No images available</span>
        </div>
      </div>
    );
  }

  const selectedImage = images[selectedImageIndex] || images[0];

  return (
    <div className={className}>
      {/* Main Image */}
      <div className="aspect-w-4 aspect-h-3 bg-gray-200 rounded-lg overflow-hidden mb-4">
        <img
          src={selectedImage}
          alt={`${title} - Image ${selectedImageIndex + 1}`}
          className="w-full h-64 object-cover"
        />
      </div>

      {/* Thumbnails - Desktop Layout */}
      {images.length > 1 && (
        <>
          {/* Desktop: Grid of thumbnails below main image */}
          <div className="hidden md:grid grid-cols-5 gap-2">
            {images.slice(0, 5).map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`aspect-w-1 aspect-h-1 bg-gray-200 rounded-md overflow-hidden border-2 transition-all hover:border-blue-300 ${
                  selectedImageIndex === index 
                    ? 'border-blue-500 ring-2 ring-blue-200' 
                    : 'border-gray-300'
                }`}
              >
                <img
                  src={image}
                  alt={`${title} - Thumbnail ${index + 1}`}
                  className="w-full h-16 object-cover"
                />
              </button>
            ))}
          </div>

          {/* Mobile: Horizontal scrollable row */}
          <div className="md:hidden">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {images.slice(0, 5).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index 
                      ? 'border-blue-500 ring-2 ring-blue-200' 
                      : 'border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${title} - Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Image counter */}
      {images.length > 1 && (
        <div className="text-center mt-2 text-sm text-gray-600">
          {selectedImageIndex + 1} of {images.length}
        </div>
      )}
    </div>
  );
}