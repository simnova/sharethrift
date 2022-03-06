import React, { FC, useState } from 'react';
import { useQuery } from "@apollo/client";
import { AccountMenuAccountsDocument } from '../../../../generated';
import PropTypes, { InferProps } from 'prop-types';


import {  Menu } from 'antd';
import { Link , useLocation, matchRoutes} from 'react-router-dom';

const ComponentPropTypes = {
  itemSelected: PropTypes.func
}

export interface ComponentProp {
  itemSelected: (id:string) => void
}

export type ComponentProps = InferProps<typeof ComponentPropTypes> & ComponentProp;

export const AccountMenu: FC<any> = ({itemSelected}) => {
  const location =  useLocation();

  const { loading, error, data} = useQuery(AccountMenuAccountsDocument,{
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

  var menuPages = data.accounts.map((account) => {
    return {
      key: account?.id,
      name: account?.name,
      path: `/account/${account?.handle}/`
    }
  });
  const matchedPages =  matchRoutes(menuPages,location);
  const matchedIds = matchedPages ? matchedPages.map((x:any) => x.route.key.toString()) : [];

  return <>
    <Menu
        defaultSelectedKeys={matchedIds}
        theme="light"
      >
    {
      data.accounts.map((account) => {
        if (account !== null) {
          return <>
          <Menu.Item key={account.id}>
            <Link to={`/account/${account?.handle}/`}>{account.name}</Link>
          </Menu.Item>
        </>
        }
      })
    }
    </Menu> 
  </>

}