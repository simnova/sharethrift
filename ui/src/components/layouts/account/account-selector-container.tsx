import React, { FC, useState } from 'react';
import { useQuery } from "@apollo/client";
import { AccountMenuAccountsDocument } from '../../../generated';
import { AccountSelector } from './account-selector';
import { useNavigate } from 'react-router-dom';


import { Link , useLocation, matchRoutes} from 'react-router-dom';



export const AccountSelectorContainer: FC<any> = ({itemSelected}) => {
  const navigate = useNavigate();

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

  if(data.accounts.length === 1){
    navigate(`/account/${data.accounts[0]?.handle}/`)

  }



  return <>
    <AccountSelector data={{accounts:data.accounts as any}} />
  </>

}