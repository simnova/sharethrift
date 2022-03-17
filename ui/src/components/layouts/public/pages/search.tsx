import React from 'react';
import { SearchResultsContainer } from './search-results-container';
import { SearchBox } from '../components/search-box';

export const Search: React.FC<any> = (props) => {
  return (
    <div>

      <div className="pt-8 pb-8">
      <SearchBox />
      <SearchResultsContainer  />
      </div>

    </div>      
  )
}