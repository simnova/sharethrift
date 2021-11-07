import React, { FC, useState } from 'react';
import { useMutation } from "@apollo/client";
import {ListingCreateDocument, ListingDetail} from '../generated';
import { CategorySelection } from './category-selection';
import { AccountSelection } from './account-selection';


export const ListingCreate: FC<any> = () => {
  const [category, setCategory] = useState("");
  const [account, setAccount] = useState("");
  let title: HTMLInputElement | null = null;
  let description: HTMLInputElement | null = null;
  const [addListing, { data, loading, error }] = useMutation(ListingCreateDocument);

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

  if (typeof data === 'undefined' ) {
    return <>     
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          addListing({ variables: { 
            input : {
              title: title?.value,
              description: description?.value,
              primaryCategory: category,
              account: account
            } as ListingDetail
          } 
          });
        }}
      >
        Category:
        <CategorySelection itemSelected={setCategory} /><br/>
        
       
        Account:
        <AccountSelection itemSelected={setAccount} /><br/>
       
        
        Title:
        <input
          ref={node => {
            title = node;
          }}
        />
        <br/>
        Description:
        <input
          ref={node => {
            description = node;
          }}
          
        />
        <button type="submit">Add Listing</button>
      </form>
    </div>
    </>
  }

  return <>
    <div>{JSON.stringify(data)}</div>
  </>
  
}