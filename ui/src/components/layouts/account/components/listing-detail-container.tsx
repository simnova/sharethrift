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
  const [updateDraft, { error }] = useMutation(ListingDetailContainerUpdateDraftDocument);
  const [publishDraft] = useMutation(ListingDetailContainerPublishDraftDocument);
  const [unpublish] = useMutation(ListingDetailContainerUnpublishDocument);
  const [createDraft] = useMutation(ListingDetailContainerCreateDraftDocument);

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
    } catch (saveError) {
      message.error(`Error updating listing: ${JSON.stringify(saveError)}`);
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
    } catch (publishError) {
      message.error(`Error updating listing: ${JSON.stringify(publishError)}`);
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
    } catch (publishError) {
      message.error(`Error unpublishing listing: ${JSON.stringify(publishError)}`);
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
    } catch (publishError) {
      message.error(`Error creating draft: ${JSON.stringify(publishError)}`);
    }
  }

  const content = () => {
    if(listingLoading ) {
      return <div><Skeleton active /></div>
    } else if(listingError || error) {
      return <div>{JSON.stringify(listingError)} {JSON.stringify(error)}</div>
    } else if(listingData && listingData.listing ) {
      return <ListingDetail data={listingData.listing} onSave={handleSave} onPublish={handlePublish} onUnpublish={handleUnpublish} onCreateDraft={handleCreateDraft} />
    } else {
      return <div>No Data...</div>
    }
  }

  return (<>
      <h1>Listing Detail</h1>
      {content()}
  </>)
}