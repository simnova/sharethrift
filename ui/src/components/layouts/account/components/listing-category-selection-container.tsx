import React, { FC } from 'react';
import { useQuery } from "@apollo/client";
import { CategorySelectionCategoriesDocument } from '../../../../generated';
import PropTypes, { InferProps } from 'prop-types';
import { ListingCategorySelection } from './listing-category-selection';

import { Select } from 'antd';
const { Option } = Select;

const ComponentPropTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func
}

export interface ComponentProp {
  onChange?: (value:string) => void
  value?: string
}

export type ComponentProps = InferProps<typeof ComponentPropTypes> & ComponentProp;

export const ListingCategorySelectionContainer: FC<any> = (props) => {

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
    <ListingCategorySelection data={data.categories} onChange={props.onChange} value={props.value} />


  </>

}