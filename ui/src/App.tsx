import React from 'react';
import './App.css';
import { Routes, Route } from "react-router-dom";
import { Account } from "./components/layouts/account";
import { Admin } from "./components/layouts/admin";
import Main from './components/layouts/main';
import ApolloConnection from './components/core/apollo-connection';
import RequireMsal from './components/require-msal';

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
  <ApolloConnection>
            <Main/>
          </ApolloConnection>
  </>

  return (
    <>
      <Routes>
        <Route path="/login">
        </Route>
        <Route path="/account/*" element={accountPage}>
          
        </Route>
        <Route path="/admin/*" element={adminPage}>
          
        </Route>
        <Route path="/" element={mainPage}>
        </Route>
      </Routes>
    </>
  );
}

export default App;
