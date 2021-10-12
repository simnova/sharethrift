import React, { FC } from 'react';
import { useQuery } from "@apollo/client";
import { CategorySelectionCategoriesDocument } from '../generated';
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

export const CategorySelection: FC<ComponentProps> = ({
  itemSelected
}) => {

  const { loading, error, data} = useQuery(CategorySelectionCategoriesDocument,{
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

  if (typeof data === 'undefined' || typeof data.categories === 'undefined' || data.categories === null ) {
    return <>
      <div>No Data...</div>
    </>
  }

  return <>
    <div>

    <Select onChange={(item) => {itemSelected(item) }} style={{ width: 120 }}>
      {
        data.categories.map((category) => {
          if (category !== null) {
            return <Option value={category.id}>{category.name}</Option>
          }
        })
      }
    </Select>

    </div>
  </>

}