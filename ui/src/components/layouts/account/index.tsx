import React from 'react';
import { AccountLayout } from './account-layout';
import { Home } from './pages/home';
import { Routes, Route } from "react-router-dom";
import { Simple } from './pages/simple';
import { Child1 } from './pages/child1';
import { Child2 } from './pages/child2';

import { HomeOutlined, MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';


export const Account: React.FC<any> = (props) => {
  const pageLayouts = [
    {path : '/account/', title : 'Home', icon : <HomeOutlined />, id:'ROOT'},
    {path : '/account/simple', title : 'Simple', icon : <MailOutlined /> , id:1, parent: 'ROOT'},
    {path : '/account/simple/1/*', title : 'Child 1', icon : <AppstoreOutlined /> , id:2, parent: 1},
    {path : '/account/simple/2', title : 'Child 2', icon : <SettingOutlined /> , id:3, parent: 1},
  ]

  return (
    <>
      <Routes>
        <Route path="" element={<AccountLayout pageLayouts={pageLayouts} />}>
          <Route path="/" element={<Home />} />
          <Route path="/simple" element={<Simple />} />
          <Route path="/simple/1/*" element={<Child1 />} />
          <Route path="/simple/2" element={<Child2 />} />
        </Route>
      </Routes>
    </>
  );
}