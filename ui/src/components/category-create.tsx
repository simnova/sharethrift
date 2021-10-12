import React, { FC } from 'react';
import { useMutation } from "@apollo/client";
import {CategoryCreateDocument} from '../generated';


export const CategoryCreate: FC<any> = () => {
  let input: HTMLInputElement | null = null;
  const [addCategory, { data, loading, error }] = useMutation(CategoryCreateDocument);

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
          addCategory({ variables: { 
            category : {
              name: input?.value
            }
          } 
          });
        }}
      >
        Category Name:
        <input
          ref={node => {
            input = node;
          }}
        />
        <br/>
        <button type="submit">Add Category</button>
      </form>
    </div>
    </>
  }

  return <>
    <div>{JSON.stringify(data)}</div>
  </>
  
}