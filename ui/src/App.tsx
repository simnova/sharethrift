import React from 'react';
import './App.css';
import { Routes, Route } from "react-router-dom";
import ApolloConnection from './components/core/apollo-connection';
import RequireMsal from './components/require-msal';

import { Account } from "./components/layouts/account/";
import { AccountSelectorContainer } from './components/layouts/account/account-selector-container';
import { Admin } from "./components/layouts/admin";
import { Public } from './components/layouts/public/';
import { Payment} from './components/layouts/account/components/payment';
import { Payment2 } from './components/layouts/account/components/payment2';

function App() {

  const accountPage = <>
    <RequireMsal identifier="account">
      <ApolloConnection AuthenticationIdentifier="account">
        <Account />
      </ApolloConnection>
    </RequireMsal>
  </>

  const accountSelectorPage = <>
    <RequireMsal identifier="account">
      <ApolloConnection AuthenticationIdentifier="account">
        <AccountSelectorContainer />
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

  const paymentPage = <>
    <ApolloConnection>
      <Payment />
    </ApolloConnection>
  </>

  const paymentPage2 = <>
    <ApolloConnection>
      <Payment2 />
    </ApolloConnection>
  </>

  return (
    <>
      <Routes>
        <Route path="/account" element={accountSelectorPage} />
        <Route path="/account/:handle/*" element={accountPage} />
        <Route path="/admin" element={adminPage} />
        <Route path="/payment" element={paymentPage} />
        <Route path="/payment2" element={paymentPage2} />
        <Route path="/*" element={mainPage}>
        </Route> 
      </Routes>
    </>
  );
}

export default App;