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
import { useState } from "react"  ;


export const ListingDetailContainer: React.FC<any> = (props) => {
  const [publishRequestProcessing, setPublishRequestProcessing] = useState(false);
  const [publishResult, setPublishResult] = useState<string|null>(null);
  const { data: listingData, loading: listingLoading, error: listingError, startPolling, stopPolling } = useQuery(ListingDetailContainerListingsDocument,{
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
        }
      });
      message.success("Listing updated successfully");
    } catch (saveException) {
      message.error(`Error updating listing: ${JSON.stringify(saveException)}`);
    }    
  }


  const handlePublish = async () => {
    console.log("publish requested");
    try {
      setPublishRequestProcessing(true);
      await publishDraft({
        variables: {
          id: props.listingId
        }
      });
      startPolling(5000);
    } catch (publishException) {
      message.error(`Error updating listing: ${JSON.stringify(publishException)}`);
    }    
  }
  const handleUnpublish = async () => {
    
    try {
      await unpublish({
        variables: {
          id: props.listingId
        }
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

  const getCurrentStatusCode = ():string => {
    if(!listingData?.listing || !listingData.listing.draft?.statusHistory || listingData.listing.draft.statusHistory.length === 0){ return "DRAFT"; }
    let sortedArray = listingData.listing.draft.statusHistory.slice() as any;
    console.log(sortedArray);
    sortedArray.sort((a:any,b:any) => 
    {
      let aTime = (new Date(a.createdAt)).getTime();
      let bTime = (new Date(b.createdAt)).getTime();
      if(bTime > aTime){
        return 1;
      }else if(bTime < aTime){
        return -1;
      }else{
        return 0;
      }
    });
    let newestHistoryItem = sortedArray[0];
    return newestHistoryItem?.statusCode as string
  }

  if(publishRequestProcessing && (listingData && listingData.listing)){
    
    if(
      listingData.listing.draft && 
      listingData.listing.draft.statusHistory && 
      listingData.listing.draft.statusHistory.length > 0)
      {
        let currentStatusCode = getCurrentStatusCode();
        if(currentStatusCode === 'REJECTED' || currentStatusCode === 'APPROVED'){
          setPublishRequestProcessing(false);
          setPublishResult(currentStatusCode);
          stopPolling();        
        }
        else {
          console.log('waiting for approval');
          console.log('currentStatusCode: ' + currentStatusCode);
        }
      }
  }

  const content = () => {
    if(listingLoading || updateLoading || publishLoading || unpublishLoading || createDraftLoading || publishRequestProcessing) {
      return <div><Skeleton active /></div>
    } else if(listingError || updateError || publishError || unpublishError || createDraftError) {
      return <div>Error:
        {JSON.stringify(listingError)} 
        {JSON.stringify(updateError)}
        {JSON.stringify(publishError)}
        {JSON.stringify(unpublishError)}
        {JSON.stringify(createDraftError)}
      </div>
    } else if(listingData && listingData.listing)  {
      
      if(publishResult){
      //  message.success(`Listing was ${publishResult}`);  // this is not working
      }
      return (
        <div>
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