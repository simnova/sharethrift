import { 
  ListingDetailContainerListingsDocument, 
  ListingDetailContainerUpdateDraftDocument,
  ListingDetailContainerUnpublishDocument,
  ListingDetailContainerPublishDraftDocument,
  ListingDetailContainerCreateDraftDocument
 } from "../../../../generated";
import { useQuery, useMutation } from "@apollo/client";
import { ListingDetail } from "./listing-detail";
import { message,  Skeleton } from 'antd';

export const ListingDetailContainer: React.FC<any> = (props) => {
  const { data: listingData, loading: listingLoading, error: listingError } = useQuery(ListingDetailContainerListingsDocument,{
    variables: {
      id: props.listingId
    }
  });
  const [updateDraft, {loading:updateLoading, error:updateError }] = useMutation(ListingDetailContainerUpdateDraftDocument);
  const [publishDraft,{loading:publishLoading, error:publishError }] = useMutation(ListingDetailContainerPublishDraftDocument);
  const [unpublish,{loading:unpublishLoading, error:unpublishError }] = useMutation(ListingDetailContainerUnpublishDocument);
  const [createDraft,{loading:createDraftLoading, error:createDraftError }] = useMutation(ListingDetailContainerCreateDraftDocument);

  const handleSave = async (values: any) => {
    values.draft.id = props.listingId;
    values.draft.primaryCategory = values.draft.primaryCategory.id;
    try {
      await updateDraft({
        variables: {
          input: values.draft
        },
        refetchQueries: [
          {
            query:ListingDetailContainerListingsDocument,
            variables: {
              id: props.listingId
            }
          }
        ]
      });
      message.success('Saved');
    } catch (saveException) {
      message.error(`Error updating listing: ${JSON.stringify(saveException)}`);
    }    
  }

  const handlePublish = async () => {
    try {
      await publishDraft({
        variables: {
          id: props.listingId
        },
        refetchQueries: [
          {
            query:ListingDetailContainerListingsDocument,
            variables: {
              id: props.listingId
            }
          }
        ]
      });
      message.success('Published');
    } catch (publishException) {
      message.error(`Error updating listing: ${JSON.stringify(publishException)}`);
    }    
  }
  const handleUnpublish = async () => {
    try {
      await unpublish({
        variables: {
          id: props.listingId
        },
        refetchQueries: [
          {
            query:ListingDetailContainerListingsDocument,
            variables: {
              id: props.listingId
            }
          }
        ]
      });
      message.success('UnPublished');
    } catch (publishException) {
      message.error(`Error unpublishing listing: ${JSON.stringify(publishException)}`);
    }    
  }
  const handleCreateDraft = async () => {
    try {
      await createDraft({
        variables: {
          id: props.listingId
        }
      });
      message.success('Created Draft');
    } catch (createDraftException) {
      message.error(`Error creating draft: ${JSON.stringify(createDraftException)}`);
    }
  }

  const content = () => {
    if(listingLoading || updateLoading || publishLoading || unpublishLoading || createDraftLoading) {
      return <div><Skeleton active /></div>
    } else if(listingError || updateError || publishError || unpublishError || createDraftError) {
      return <div>
        {JSON.stringify(listingError)} 
        {JSON.stringify(updateError)}
        {JSON.stringify(publishError)}
        {JSON.stringify(unpublishError)}
        {JSON.stringify(createDraftError)}
      </div>
    } else if(listingData && listingData.listing ) {
      return (
        <div>
          {JSON.stringify(listingData)}
          <ListingDetail key={listingData.listing.id} data={listingData.listing} onSave={handleSave} onPublish={handlePublish} onUnpublish={handleUnpublish} onCreateDraft={handleCreateDraft} />
        </div>
      )
    } else {
      return <div>No Data...</div>
    }
  }

  return (
    <div>
      <h1>Listing Detail</h1>
      {content()}
    </div>
  )
}