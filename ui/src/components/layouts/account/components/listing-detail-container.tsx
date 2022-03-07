import { ListingDetailContainerListingsDocument, ListingDetailContainerUpdateDraftDocument,ListingDetailContainerPublishDraftDocument } from "../../../../generated";
import { useQuery, useMutation } from "@apollo/client";
import { ListingDetail } from "./listing-detail";

export const ListingDetailContainer: React.FC<any> = (props) => {
  const { data: listingData, loading: listingLoading, error: listingError } = useQuery(ListingDetailContainerListingsDocument,{
    variables: {
      id: props.listingId
    }
  });
  const [updateDraft, { data, loading, error }] = useMutation(ListingDetailContainerUpdateDraftDocument);
  const [publishDraft] = useMutation(ListingDetailContainerPublishDraftDocument);

  const handleSave = (values: any) => {
    values.id = props.listingId;
    updateDraft({
      variables: {
        input: values
      }
    });
  }

  const handlePublish = () => {
    publishDraft({
      variables: {
        id: props.listingId
      }
    });
  }

  if(listingLoading || loading) {
    return <div>Loading...</div>
  }
  if(listingError || error) {
    return <div>{JSON.stringify(listingError)} {JSON.stringify(error)}</div>
  }
  if(listingData && listingData.listing) {
    return <ListingDetail data={listingData.listing} onSave={handleSave} onPublish={handlePublish} />
  } else {
    return <div>No Data...</div>
  }
}