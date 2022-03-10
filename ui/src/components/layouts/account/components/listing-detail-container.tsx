import { ListingDetailContainerListingsDocument, ListingDetailContainerUpdateDraftDocument,ListingDetailContainerPublishDraftDocument } from "../../../../generated";
import { useQuery, useMutation } from "@apollo/client";
import { ListingDetail } from "./listing-detail";
import { message, PageHeader, Skeleton } from 'antd';

export const ListingDetailContainer: React.FC<any> = (props) => {
  const { data: listingData, loading: listingLoading, error: listingError } = useQuery(ListingDetailContainerListingsDocument,{
    variables: {
      id: props.listingId
    }
  });
  const [updateDraft, { data, loading, error }] = useMutation(ListingDetailContainerUpdateDraftDocument);
  const [publishDraft] = useMutation(ListingDetailContainerPublishDraftDocument);

  const handleSave = async (values: any) => {
    console.log('vlaue;',values);
    values.draft.id = props.listingId;
    values.draft.primaryCategory = values.draft.primaryCategory.id;
    console.log('vlaue2',values.draft);
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
    } catch (error) {
      message.error(`Error updating listing: ${JSON.stringify(error)}`);
    }    
  }

  const handlePublish = () => {
    publishDraft({
      variables: {
        id: props.listingId
      }
    });
  }

  const content = () => {
    if(listingLoading ) {
      return <div><Skeleton active /></div>
    } else if(listingError || error) {
      return <div>{JSON.stringify(listingError)} {JSON.stringify(error)}</div>
    } else if(listingData && listingData.listing ) {
      return <ListingDetail data={listingData.listing} onSave={handleSave} onPublish={handlePublish} />
    } else {
      return <div>No Data...</div>
    }
  }

  return (<>
      <h1>Listing Detail</h1>
      {content()}
  </>

  )
}