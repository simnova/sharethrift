export interface PropTypes {
  data: {
    photos: {
      order: number,
      documentId: string,
    }[]
  }
}


export const SearchResultImages: React.FC<PropTypes> = (props) => {
  const hasPhotos = props.data && props.data.photos && props.data.photos.length > 0;
  if(!hasPhotos) {
    return <></>;
  }
  const photoPrefix = 'https://sharethrift.blob.core.windows.net/public/';
  const photoCount = props.data.photos.length;
  const secondaryPhotos = () => {
    if(photoCount === 1) {
      return <></>;
    }
    return props.data.photos.slice(1).map((photo, index) => {
      return (
        <div key={index} className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden hidden sm:inline-block">
          <img src={photoPrefix+ photo.documentId} alt="Model wearing plain gray basic tee." className="w-full h-52 object-center object-cover" />
        </div>
      );
    });
  }

  return (
    <div>
        <div key={1} className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden inline-block">
          <img src={photoPrefix+ props.data.photos[0].documentId} alt="Model wearing plain gray basic tee." className="w-full h-60 sm:h-52 object-center object-cover" />
        </div>

    {secondaryPhotos()}
    </div>
  )
  
}