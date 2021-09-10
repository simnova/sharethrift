import { FC,useState } from 'react';
import { useQuery, gql } from "@apollo/client";
import { UserListGetUsersDocument, UserListGetUsersQueryVariables, UserListGetUsersFieldsFragment, UserListItemFieldsFragment } from '../generated';

import React from 'react';
import { UserListItem } from './user-list-item';
import PropTypes, { InferProps } from 'prop-types';

const ComponentPropTypes = {
  itemSelected: PropTypes.func
}

export interface ComponentProp {
  itemSelected: (id:string) => void
}

export type ComponentProps = InferProps<typeof ComponentPropTypes> & ComponentProp;

export const UserList: FC<ComponentProps> = ({
  itemSelected
}) => {

  type results = {getUsers:[UserListGetUsersFieldsFragment & UserListItemFieldsFragment]};
  const { loading, error, data} = useQuery<results,UserListGetUsersQueryVariables>(UserListGetUsersDocument,{
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

  if (typeof data === 'undefined' ) {
    return <>
      <div>No Data...</div>
    </>
  }

  return <>
    <div>
    {
      data.getUsers.map((user) => {
        let temp = user as UserListItemFieldsFragment;
        return <UserListItem key={user._id} {...temp} onClick={() => {itemSelected(user._id)}} />
      })
    }
    </div>

  </>

}