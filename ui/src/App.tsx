import React from "react";
import "./App.css";
import { Switch, Route } from 'react-router-dom';
import { Account } from "./components/layouts/account";
import { Admin } from "./components/layouts/admin";
import Main from './components/layouts/main';
import ApolloConnection from './components/core/apollo-connection';
import RequireMsal from './components/require-msal';

function App() {

  return (
    <Switch>
        <Route exact path="/login">
        </Route>
        <Route path="/account">
          <RequireMsal identifier="account">
            <ApolloConnection AuthenticationIdentifier="account">
              <Account />
            </ApolloConnection>
            
          </RequireMsal>
        </Route>
        <Route path="/admin">
          <RequireMsal identifier="admin">
            <ApolloConnection AuthenticationIdentifier="admin">
              <Admin />
            </ApolloConnection>
          </RequireMsal>
        </Route>
        <Route exact path="/">
          <ApolloConnection>
            <Main/>
          </ApolloConnection>
        </Route>
      </Switch>
   
    
  );
}

export default App;
