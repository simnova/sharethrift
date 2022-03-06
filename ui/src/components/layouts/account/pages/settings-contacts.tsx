import React from 'react';
import { useParams } from 'react-router-dom';
import { AccountSettingsContactsContainer } from '../components/account-settings-contacts-container';

export const Contacts: React.FC<any> = (props) => {
  const params = useParams();

  return (
    <>
      <h1>Contacts</h1>
      {params.handle && <AccountSettingsContactsContainer data={{handle: params.handle}} />}
    </>
  )
}