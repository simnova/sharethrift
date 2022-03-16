import React from 'react';
import Login from '../../../../components/login';
import { SearchResultsContainer } from './search-results-container';
import { SearchBox } from '../components/search-box';
import { useSearchParams } from 'react-router-dom';

export const Search: React.FC<any> = (props) => {
  let [searchParams, setSearchParams] = useSearchParams();
  //const searchParams = new URLSearchParams(searchParams)
  return (
    <div>

      <div className="pt-8 pb-8">
      <SearchBox />
      <SearchResultsContainer data={{searchString:searchParams.get('search')}} />
      </div>

    </div>
     
  
  )
}