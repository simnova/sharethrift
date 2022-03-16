import { SearchResults } from './search-results';
import { useQuery } from '@apollo/client';
import { SearchResultsContainerListingSearchDocument, ListingSearchInput } from "../../../../generated";
import { Skeleton } from 'antd';
import { json } from 'stream/consumers';
import { TagList } from '../components/tag-list';
import { useSearchParams } from 'react-router-dom';

export const SearchResultsContainer: React.FC<any> = (props) => {
  let [searchParams, setSearchParams] = useSearchParams();
  const { data: listingData, loading: listingLoading, error: listingError } = useQuery(SearchResultsContainerListingSearchDocument,{
    variables: {
      input: {
        searchString: searchParams.get('search') ?? '*',
        tags:  searchParams.get('tags')?.split(',') ?? [],
      }
    }
  });

  const updateSearchString = (tags:string[]) => {
    var searchString = searchParams.get('search');
    var tagsString = tags? "tags="+tags.join(',') : '';
    setSearchParams(new URLSearchParams(`search=${searchString}&${tagsString}`));
  }

  console.log('searching for',searchParams.get('search'));
  console.log('searching for',searchParams.get('tags')?.split(','));
  const content = () => {
    if(listingLoading ) {
      return <div><Skeleton active /></div>
    } else if(listingError) {
      return <div>{JSON.stringify(listingError)}</div>
    } else if(listingData && listingData.listingSearch && listingData.listingSearch.listingResults) {
      
      return<div>

<TagList data={{tags:listingData.listingSearch.facets?.tags as any, selectedTags:searchParams.get('tags')?.split(',') ?? []}} onChange={(value) => {console.log('value:'+ JSON.stringify(value)); updateSearchString(value);}} />
<SearchResults data={listingData.listingSearch.listingResults} />
      </div> 
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