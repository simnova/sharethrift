import React, { FC } from 'react';
import Login from '../../components/login';

const Main: FC<any> = (props) => {

  return (
    <>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <Login />
        
        <br/>        
    </>
  )
}

export default Main;