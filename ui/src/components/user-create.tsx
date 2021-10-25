import React, { FC } from 'react';
import { useMutation } from "@apollo/client";
import {UserCreateDocument} from '../generated';


export const UserCreate: FC<any> = () => {
  const [createUser, { data, loading, error }] = useMutation(UserCreateDocument);

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
            createUser();
          }}
        >
          <button type="submit">Create User</button>
        </form>
      </div>
    </>
  }

  return <>
    <div>{JSON.stringify(data)}</div>
  </>
  
}