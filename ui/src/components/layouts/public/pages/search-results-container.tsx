import { SearchResults } from './search-results';
import { useQuery } from '@apollo/client';
import { SearchResultsContainerListingSearchDocument, ListingSearchInput } from "../../../../generated";
import { Skeleton } from 'antd';

export const SearchResultsContainer: React.FC<any> = (props) => {
  const { data: listingData, loading: listingLoading, error: listingError } = useQuery(SearchResultsContainerListingSearchDocument,{
    variables: {
      input: {
        searchString: props.data.searchString ?? '*',
      }
    }
  });
  console.log('searching for',props.data.searchString);
  const content = () => {
    if(listingLoading ) {
      return <div><Skeleton active /></div>
    } else if(listingError) {
      return <div>{JSON.stringify(listingError)}</div>
    } else if(listingData && listingData.listingSearch && listingData.listingSearch) {
      
      return <SearchResults data={listingData.listingSearch} />
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