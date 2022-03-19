import React from 'react';
import { AccountLayout } from './account-layout';
import { Home } from './pages/home';
import { Routes, Route, useParams } from "react-router-dom";
import { Settings } from './pages/settings';
import { Listings } from './pages/listings';
import { Child2 } from './pages/child2';
import { ProfileContainer } from './pages/profile-container';

import { HomeOutlined, MailOutlined, AppstoreOutlined, SettingOutlined , BarsOutlined, IdcardOutlined} from '@ant-design/icons';

export const Account: React.FC<any> = (props) => {

  const pageLayouts = [
    {path : '/account/:handle/', title : 'Home', icon : <HomeOutlined />, id:'ROOT'},
    {path : '/account/:handle/profile', title : 'Profile', icon : <IdcardOutlined /> , id:1, parent: 'ROOT'},
    {path : '/account/:handle/settings/*', title : 'Account', icon : <SettingOutlined /> , id:2, parent: 'ROOT'},
    {path : '/account/:handle/listings/*', title : 'Listings', icon : <BarsOutlined /> , id:3, parent: 'ROOT'},
  ]
  
  return (
    <>
      <Routes>
        <Route path="" element={<AccountLayout pageLayouts={pageLayouts} />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<ProfileContainer />} />
          <Route path="/settings/*" element={<Settings />} />
          <Route path="/simple/2" element={<Child2 />} />
          <Route path="/listings/*" element={<Listings />} />
        </Route>
      </Routes>
    </>
  );

}