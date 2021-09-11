import { FC,useState } from 'react';
import { useQuery, gql } from "@apollo/client";
import { UserProfileDetailDocument, UserProfileDetailQueryVariables, UserProfileDetailFieldsFragment } from '../generated';
import React from 'react';
import PropTypes, { InferProps } from 'prop-types';
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
  type results =  {user:UserProfileDetailFieldsFragment};
  const { loading, error, data} = useQuery<results,UserProfileDetailQueryVariables>(UserProfileDetailDocument,{
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
      <div>Email: {data.user.email}</div>
      <div>Created At: {moment(data.user.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</div>
      <div>Updated At: {moment(data.user.updatedAt).format('MMMM Do YYYY, h:mm:ss a')}</div>
    </div>
  </>
  
}