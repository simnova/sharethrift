import React, { FC } from 'react';
import Login from '../../components/login';

const Main: FC<any> = (props) => {

  return (
    <>
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <Login />
        
        <br/>        
      </header>
    </>
  )
}

export default Main;