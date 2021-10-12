import React, { FC } from 'react';
import { useQuery } from "@apollo/client";
import { UserListGetUsersDocument, UserListItemFieldsFragment } from '../generated';
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

  const { loading, error, data} = useQuery(UserListGetUsersDocument,{
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

  if (typeof data === 'undefined' || typeof data.users === 'undefined' || data.users === null ) {
    return <>
      <div>No Data...</div>
    </>
  }

  return <>
    <div>
    {
      data.users.map((user) => {
        if (user !== null) {
          return <UserListItem key={user.id} {...(user as UserListItemFieldsFragment)} onClick={() => {itemSelected(user.id)}} />
        }
      })
    }
    </div>
  </>

}