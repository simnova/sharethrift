import React from 'react';
import { useParams } from 'react-router-dom';
import { AccountSettingsGeneralContainer,  } from '../components/account-settings-general-container';

export const General: React.FC<any> = (props) => {
  const params = useParams();
  return (
    <>
      <h1>General</h1>
      {params.handle && <AccountSettingsGeneralContainer data={{handle: params.handle}} />}
    </>
  )
} 