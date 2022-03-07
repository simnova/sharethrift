import React from 'react';
import { useParams } from 'react-router-dom';
import { ListingsList} from './listings-list';
import { ListingsDetail } from './listings-detail';
import { Routes, Route } from 'react-router-dom';

export const Listings: React.FC<any> = (props) => {
  const params = useParams();
  return (
    <Routes>
      <Route path="" element={<ListingsList />} />
      <Route path="/:listingId" element={<ListingsDetail />} />
    </Routes>
  )
}