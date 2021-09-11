import { FC,useState } from 'react';
import { useQuery, gql } from "@apollo/client";
import { UserProfileDocument, UserProfileQueryVariables, UserProfileFieldsFragment } from '../generated';
import React from 'react';
import PropTypes, { InferProps } from 'prop-types';

const ComponentPropTypes = {
  userId: PropTypes.string,
}

export interface ComponentProp {
  userId: string,
} 

export type ComponentProps = InferProps<typeof ComponentPropTypes> & ComponentProp;

export const UserProfile: FC<ComponentProps> = ({
  userId,
}) => {
  type results =  {user:UserProfileFieldsFragment};
  const { loading, error, data} = useQuery<results,UserProfileQueryVariables>(UserProfileDocument,{
    variables: {
      userId: userId
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

  if (typeof data === 'undefined' ) {
    return <>     
      <div>No Data...</div>
    </>
  }

  return <>
    <div>
      <div>ID: {data.user.id}</div>
      <div>First Name: {data.user.firstName}</div>
      <div>Last Name: {data.user.lastName}</div>
    </div>
  </>
  
}