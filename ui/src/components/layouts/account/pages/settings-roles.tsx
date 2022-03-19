import React from 'react';
import { AccountSettingsRolesContainer } from '../components/account-settings-roles-container';
import { useParams } from 'react-router-dom';
export const Roles: React.FC<any> = (props) => {
  const params = useParams();

  return (
    <>

      {params.handle && <AccountSettingsRolesContainer data={{handle: params.handle}} />}
    </>
  )
}