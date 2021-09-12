import React, { FC } from 'react';
import PropTypes, { InferProps } from 'prop-types';
import { useQuery } from "@apollo/client";
import { UserProfileDetailDocument } from '../generated';
import moment from 'moment';

const ComponentPropTypes = {
  userId: PropTypes.string,
}

export interface ComponentProp {
  userId: string,
} 

export type ComponentProps = InferProps<typeof ComponentPropTypes> & ComponentProp;

export const UserProfileDetail: FC<ComponentProps> = ({
  userId,
}) => {
  const { loading, error, data} = useQuery(UserProfileDetailDocument,{
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

  if (typeof data === 'undefined' || typeof data.user === 'undefined' || data.user === null) {
    return <>     
      <div>No Data...</div>
    </>
  }

  return <>
    <div>
      <div>ID: {data.user.id}</div>
      <div>First Name: {data.user.firstName}</div>
      <div>Email: {data.user.email}</div>
      <div>Created At: {moment(data.user.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</div>
      <div>Updated At: {moment(data.user.updatedAt).format('MMMM Do YYYY, h:mm:ss a')}</div>
    </div>
  </>
  
}