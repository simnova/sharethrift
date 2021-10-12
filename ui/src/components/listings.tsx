import React, { FC } from 'react';
import { useQuery } from "@apollo/client";
import { ListingsListingsDocument } from '../generated';

export const Listings: FC<any> = () => {

  const { loading, error, data} = useQuery(ListingsListingsDocument,{
    variables: {
    }
  })
  
  if(error){
    return <>
      <div>Error :( {JSON.stringify(error)}</div>
    </>
  } 

  if(loading){
    return <>
      <div>Loading...</div>
    </>
  } 

  if (typeof data === 'undefined' || typeof data.listings === 'undefined' || data.listings === null ) {
    return <>
      <div>No Data...</div>
    </>
  }

  return <>
    <div>
    {
      data.listings.map((listing) => {
        if (listing !== null) {
          return <div key={listing.id}>
            Detail for Listing: {listing.title}<br/>
            {JSON.stringify(listing)}
          </div>
        }
      })
    }
    </div>
  </>

}