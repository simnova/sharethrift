import React from 'react';
import { ListingsList} from './listings-list';
import { ListingsDetail } from './listings-detail';
import { Routes, Route } from 'react-router-dom';

export const Listings: React.FC<any> = (props) => {
  return (
    <Routes>
      <Route path="" element={<ListingsList />} />
      <Route path="/:listingId" element={<ListingsDetail />} />
    </Routes>
  )
}