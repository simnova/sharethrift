import React, { FC } from "react";
import {  gql, useQuery, useMutation} from '@apollo/client';

const HELLO_WORLD = gql`
  query {
    hello
  }
`;

const CREATE_ACCOUNT_MUTATION = gql`
mutation Account_create($firstName:String, $lastName:String, $description:String) {
  Account_create(
    firstName:$firstName, 
    lastName:$lastName,
    description:$description)
}
`;

interface CreateAccountDetails {
  firstName: string | undefined,
  lastName: string | undefined,
  description: string | undefined
}




const HelloWorld: FC<any> = () => {

  const [createAccountAction] = useMutation<
    { createAccount: string },
    CreateAccountDetails
  >(CREATE_ACCOUNT_MUTATION);

  const { loading, error, data } = useQuery(HELLO_WORLD);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  if (data) {console.log('updated data')};

  const handleAccountCreate = async () => {
    var result = await createAccountAction({variables:{
      firstName:'patrick',
      lastName:'gidich',
      description:'test'
    }});
    console.log(result);
  }

  return (
    <span style={{fontSize:'small',lineBreak:'anywhere'}}>
    ApolloGraphQL Says: {data.hello}<br/>
    <button onClick={handleAccountCreate}>Create Account</button>
    </span>
    
  )
}

export default HelloWorld;