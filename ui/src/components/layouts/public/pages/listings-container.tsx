import { Listings } from './listings';
import { useQuery } from '@apollo/client';
import { ListingContainerListingSearchDocument, ListingSearchInput } from "../../../../generated";
import { Skeleton } from 'antd';

export const ListingsContainer: React.FC<any> = (props) => {
  const { data: listingData, loading: listingLoading, error: listingError } = useQuery(ListingContainerListingSearchDocument,{
    variables: {
      input: {
        searchString: '*',
      }
    }
  });

  const content = () => {
    if(listingLoading ) {
      return <div><Skeleton active /></div>
    } else if(listingError) {
      return <div>{JSON.stringify(listingError)}</div>
    } else if(listingData && listingData.listingSearch && listingData.listingSearch && listingData.listingSearch.listingResults) {
      
      return <Listings data={listingData.listingSearch.listingResults} />
    } else {
      return <div>No data</div>
    }
  }


  return (
    <div>
      <h1>Listings</h1>
      {content()}
    </div>
  )
}