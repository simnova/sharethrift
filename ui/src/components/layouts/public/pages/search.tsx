import React from 'react';
import Login from '../../../../components/login';
import { SearchResultsContainer } from './search-results-container';
import { SearchBox } from '../components/search-box';

export const Search: React.FC<any> = (props) => {
  //const searchParams = new URLSearchParams(searchParams)
  return (
    <div>

      <div className="pt-8 pb-8">
      <SearchBox />
      <SearchResultsContainer  />
      </div>

    </div>
     
  
  )
}