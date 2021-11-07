import React, { FC } from 'react';
import { useQuery } from "@apollo/client";
import { UserSelectionUsersDocument } from '../generated';
import PropTypes, { InferProps } from 'prop-types';


import { Select } from 'antd';
const { Option } = Select;

const ComponentPropTypes = {
  itemSelected: PropTypes.func
}

export interface ComponentProp {
  itemSelected: (id:string) => void
}

export type ComponentProps = InferProps<typeof ComponentPropTypes> & ComponentProp;

export const UserSelection: FC<ComponentProps> = ({
  itemSelected
}) => {

  const { loading, error, data} = useQuery(UserSelectionUsersDocument,{
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

    <Select onChange={(item) => {itemSelected(item) }} style={{ width: 120 }}>
      {
        data.users.map((user) => {
          if (user !== null) {
            return <Option value={user.id}>{user.firstName} {user.lastName}</Option>
          }
        })
      }
    </Select>

    </div>
  </>

}