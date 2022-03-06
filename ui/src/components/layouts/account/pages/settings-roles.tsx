import React from 'react';
import { AccountSettingsRolesContainer } from '../components/account-settings-roles-container';
import { useParams } from 'react-router-dom';
export const Roles: React.FC<any> = (props) => {
  const params = useParams();

  return (
    <>
       <h1>Roles</h1>
      {params.handle && <AccountSettingsRolesContainer data={{handle: params.handle}} />}
    </>
  )
}