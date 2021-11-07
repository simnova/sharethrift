import React, { FC } from 'react';
import { useQuery } from "@apollo/client";
import { AccountSelectionAccountsDocument } from '../generated';
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

export const AccountSelection: FC<ComponentProps> = ({
  itemSelected
}) => {

  const { loading, error, data} = useQuery(AccountSelectionAccountsDocument,{
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

  if (typeof data === 'undefined' || typeof data.accounts === 'undefined' || data.accounts === null ) {
    return <>
      <div>No Data...</div>
    </>
  }

  return <>
    <div>

    <Select onChange={(item) => {itemSelected(item) }} style={{ width: 120 }}>
      {
        data.accounts.map((account) => {
          if (account !== null) {
            return <Option value={account.id}>{account.name}</Option>
          }
        })
      }
    </Select>
  

    </div>
  </>

}