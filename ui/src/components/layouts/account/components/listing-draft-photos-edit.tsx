import React, { ReactElement } from "react";
import { ListingDraftPhotoUpload, AuthResult } from './listing-draft-photo-upload';

export interface ComponentProp {
  data: {
    photos: 
      { order: number|undefined; documentId: string|undefined; }[] | undefined
    
  },
  authorizeRequest: (file: File, order:number) => Promise<AuthResult>,
  onRemove: (order:number) => Promise<boolean>
}

export const ListingDraftPhotosEdit:React.FC<ComponentProp> = (props) => {
  
  const maxPhotos = 5;
  const blobPath = 'https://sharethrift.blob.core.windows.net/public';

  const photoList = () => {
    let elements:JSX.Element[] = [];
    for(let i = 1; i <= maxPhotos; i++) {
      const existingPhoto = props.data.photos?.find(photoItem => photoItem.order === i);
      const defaultImage = existingPhoto ? `${blobPath}/${existingPhoto.documentId}` : undefined;
      console.log(defaultImage);
      elements.push( 
        <ListingDraftPhotoUpload
          key={i}
          defaultImage={defaultImage}
          blobPath={blobPath}
          authorizeRequest={(file) => props.authorizeRequest(file, i)}
          onRemove={() => props.onRemove(i)}
          />);
    }
    return elements;
  }

  return(
    <>
      {photoList()}
    </>
  )
};