import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

import MsalProvider from './components/msal-react-lite';
import MsalProviderConfig from './config/msal-config';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>    
      <MsalProvider config={MsalProviderConfig}>
        <App/>
      </MsalProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
