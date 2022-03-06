import React from 'react';
import './App.css';
import { Routes, Route } from "react-router-dom";
import ApolloConnection from './components/core/apollo-connection';
import RequireMsal from './components/require-msal';

import { Account } from "./components/layouts/account/";
import { Admin } from "./components/layouts/admin";
import { Public } from './components/layouts/public/';
import { Home } from './components/layouts/public/pages/home';

function App() {

  const accountPage = <>
    <RequireMsal identifier="account">
      <ApolloConnection AuthenticationIdentifier="account">
        <Account />
      </ApolloConnection>
    </RequireMsal>
  </>

  const adminPage = <>
    <RequireMsal identifier="admin">
      <ApolloConnection AuthenticationIdentifier="admin">
        <Admin />
      </ApolloConnection>
    </RequireMsal>
  </>

  const mainPage = <>
    <ApolloConnection  AuthenticationIdentifier="account">
      <Public />
    </ApolloConnection>
  </>

  return (
    <>
      <Routes>
        <Route path="/account/:handle/*" element={accountPage} />
        <Route path="/admin" element={adminPage} />
        <Route path="/" element={mainPage}>
          <Route path="/" element={Home} />
        </Route> 
      </Routes>
    </>
  );
}

export default App;