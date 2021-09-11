import { FC,useState } from 'react';
import { useQuery, gql, useMutation } from "@apollo/client";
import {CategoryCreateDocument, CategoryCreateMutation, CategoryCreateMutationVariables,  UserProfileDocument, UserProfileQueryVariables, UserProfileFieldsFragment } from '../generated';
import React from 'react';
import PropTypes, { InferProps } from 'prop-types';


export const CategoryCreate: FC<any> = ({
}) => {
  let input: HTMLInputElement | null = null;
  let path: HTMLInputElement | null = null;
  const [addCategory, { data, loading, error }] = useMutation<CategoryCreateMutation,CategoryCreateMutationVariables>(CategoryCreateDocument);

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
              name: input?.value,

            }
          } 
          });
        }}
      >
        Name:
        <input
          ref={node => {
            input = node;
          }}
        />
        <br/>
        Path:
        <input
          ref={node => {
            path = node;
          }}
          
        />
        <button type="submit">Add Category</button>
      </form>
    </div>
    </>
  }

  return <>
    <div>{JSON.stringify(data)}</div>
  </>
  
}