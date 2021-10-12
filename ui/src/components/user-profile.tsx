import React, { FC } from 'react';
import { useQuery } from "@apollo/client";
import PropTypes, { InferProps } from 'prop-types';
import { UserProfileDocument } from '../generated';

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
  const { loading, error, data} = useQuery(UserProfileDocument,{
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

  if (typeof data === 'undefined' || typeof data.user === 'undefined' || data.user === null)  {
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