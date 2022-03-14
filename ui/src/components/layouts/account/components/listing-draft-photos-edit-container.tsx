import { ListingDraftPhotosEditContainerListingDocument, ListingDraftPhotosEditContainerDraftAddPhotoDocument,ListingDraftPhotosEditContainerDraftRemovePhotoDocument } from '../../../../generated';
import { useQuery, useMutation } from '@apollo/client';
import { Skeleton } from 'antd';
import { ListingDraftPhotosEdit } from './listing-draft-photos-edit'
import { AuthResult } from './listing-draft-photo-upload';
export const ListingDraftPhotosEditContainer:React.FC<any> = (props) => {
  const { data: listingData, loading: listingLoading, error: listingError } = useQuery(ListingDraftPhotosEditContainerListingDocument,{
    variables: {
      id: props.listingId
    }
  });
  const [getAuthHeader] = useMutation(ListingDraftPhotosEditContainerDraftAddPhotoDocument);
  const [removePhoto]= useMutation(ListingDraftPhotosEditContainerDraftRemovePhotoDocument);

  const handleRemovePhoto = async (order:number) : Promise<boolean> => {
    var result = await removePhoto({variables: {
      input: {
        order: order,
        listingId: props.listingId
      }
    }});
    return (result?.data?.draftRemovePhoto)?.success??false;
  }

  const content = () => {
    if(listingLoading ) {
      return <div><Skeleton active /></div>
    } else if(listingError) {
      return <div>{JSON.stringify(listingError)}</div>
    } else if(listingData && listingData.listing && listingData.listing.draft ) { 
      var photoData = listingData.listing.draft.photos?listingData.listing.draft.photos.map((photo) => {return {order: photo?.order as number|undefined, documentId: photo?.documentId as string|undefined}}): undefined;
      return (
        <ListingDraftPhotosEdit 
          data={{photos:photoData}}
          authorizeRequest={async (file, order) => {
            var result = await getAuthHeader({variables: {
              input: {
                contentType: file.type,
                contentLength: file.size,
                order: order,
                listingId: props.listingId
              }
            }});
            return result?.data?.draftAddPhoto as AuthResult;
          }}
          onRemove={handleRemovePhoto}
          />
      );
    }
  }

  return(<>
    {content()}
  </>);
};