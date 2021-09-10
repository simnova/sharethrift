import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Header} from "./components/header";
import { Users } from "./components/users";

import { Layout } from 'antd';
const {  Content } = Layout;


function App() {
  return (
      <Layout>
      <Header isLoggedIn={false} />
        <Content>

        
          <Users />
        </Content>
      </Layout>
  );
}

export default App;
