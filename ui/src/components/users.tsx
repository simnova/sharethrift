import { FC,useState } from 'react';
import { useQuery, gql } from "@apollo/client";
import { GetUserDocument, GetUserQueryVariables, UserMinimalFieldsFragment } from '../generated';
import React from 'react';



export const Queries = {
  GetUser : GetUserDocument
}



interface UserVars {
  /** 
  Provides a filter of the type of attendees
  */
  userId: string
} 

export const Users: FC<any> = 
  ({props:any}) => {
  
  const [userId, setUserId] = useState<string>("6136f67e8a406fa7089defd7");

  const [searchUserId, setSearchUserId] = useState<string>("6136f67e8a406fa7089defd7");
  const { loading, error, data} = useQuery<UserMinimalFieldsFragment,GetUserQueryVariables>(GetUserDocument,{
    variables: {
      userId: searchUserId
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
      <input style={{color:'black', width:'800px'}} type="text" value={userId} onChange={(e) => setUserId(e.target.value)}/>
      <input type="button" value="Get User" onClick={() => setSearchUserId(userId)}/>
     
      <div>No Data...</div>
    </>
  }

  return <>
    <div>Success!</div>
    <input style={{color:'black', width:'800px'}} type="text" value={userId} onChange={(e) => setUserId(e.target.value)}/>
    <input type="button" value="Get User" onClick={() => setSearchUserId(userId)}/>
  {data.firstName}  
    <div>{JSON.stringify(data)}</div>
    
  </>
  
}