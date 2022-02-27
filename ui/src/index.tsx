import React from 'react';
import ReactDOM from 'react-dom';
import './styles/tailwind.css';
import './index.less';
import './styles/ant.less';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter } from 'react-router-dom';
import MsalProvider from './components/msal-react-lite';
import MsalProviderConfig from './config/msal-config';

ReactDOM.render(
  <React.StrictMode>
    <MsalProvider config={MsalProviderConfig}>
      <BrowserRouter>    
        <App/>
      </BrowserRouter>
    </MsalProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
