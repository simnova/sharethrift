import React from 'react';
import { AccountLayout } from './account-layout';
import { Home } from './pages/home';
import { Routes, Route, useParams } from "react-router-dom";
import { Simple } from './pages/simple';
import { Settings } from './pages/settings';
import { Child2 } from './pages/child2';
import { Child3 } from './pages/child3';
import { ProfileContainer } from './pages/profile-container';

import { HomeOutlined, MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';

export const Account: React.FC<any> = (props) => {

  const pageLayouts = [
    {path : '/account/:handle/', title : 'Home', icon : <HomeOutlined />, id:'ROOT'},
    {path : '/account/:handle/simple', title : 'Simple', icon : <MailOutlined /> , id:1, parent: 'ROOT'},
    {path : '/account/:handle/settings/*', title : 'Settings', icon : <AppstoreOutlined /> , id:2, parent: 1},
    {path : '/account/:handle/simple/2', title : 'Child 2', icon : <SettingOutlined /> , id:3, parent: 1},
    {path : '/account/:handle/simple/3', title : 'Child 3', icon : <SettingOutlined /> , id:4, parent: 1},
  ]

  return (
    <>
      <Routes>
        <Route path="" element={<AccountLayout pageLayouts={pageLayouts} />}>
          <Route path="/" element={<Home />} />
          <Route path="/simple" element={<ProfileContainer />} />
          <Route path="/settings/*" element={<Settings />} />
          <Route path="/simple/2" element={<Child2 />} />
          <Route path="/simple/3" element={<Child3 />} />
        </Route>
      </Routes>
    </>
  );

}