import { useMutation, useQuery } from "@apollo/client";
import { ListingsListListingsByAccountHandleDocument } from "../../../../generated";
import { ListingsList} from "./listings-list";

export const ListingsListContainer: React.FC<any> = (props) => {
  const { data: listingData, loading: listingLoading, error: listingError } = useQuery(ListingsListListingsByAccountHandleDocument,{
    variables: {
      handle: props.data.handle
    }
  });

  if(listingLoading) {
    return <div>Loading...</div>
  }
  if(listingError) {
    return <div>{JSON.stringify(listingError)}</div>
  }
  if(listingData && listingData!.listingsByAccountHandle) {
   // return <div>dfsfd</div>
    return <ListingsList data={listingData!.listingsByAccountHandle} />
  } else {
    return <div>No Data...</div>
  }
}