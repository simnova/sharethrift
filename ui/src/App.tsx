import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Header} from "./components/header";
import { Users } from "./components/users";

import { Layout } from 'antd';
import { CategoryCreate } from "./components/category-create";
import { ListingCreate } from "./components/listing-create";
import { Listings } from "./components/listings";
const {  Content } = Layout;


function App() {

  return (
      <Layout>
      <Header isLoggedIn={false} />
        <Content>
          <CategoryCreate />
          <Users />
          <div>
            <ListingCreate />
          </div>
          <Listings/>
        </Content>
      </Layout>
  );
}

export default App;
