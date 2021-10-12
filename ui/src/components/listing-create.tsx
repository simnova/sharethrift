import React, { FC, useState } from 'react';
import { useMutation } from "@apollo/client";
import {ListingCreateDocument} from '../generated';
import { CategorySelection } from './category-selection';
import { UserSelection } from './user-selection';


export const ListingCreate: FC<any> = () => {
  const [category, setCategory] = useState("");
  const [user, setUser] = useState("");
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
              owner: user
            }
          } 
          });
        }}
      >
        Category:
        <CategorySelection itemSelected={setCategory} /><br/>
        
        User:
        <UserSelection itemSelected={setUser} /><br/>

        
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