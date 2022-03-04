import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import './account-layout.css';

import { MenuComponent } from './components/menu-component';
import { Content, Header } from 'antd/lib/layout/layout';
import { LoggedInUserContainer } from '../../ui/organisms/header/logged-in-user-container';

const { Footer, Sider } = Layout;

export const AccountLayout: React.FC<any> = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout className="site-layout" style={{ minHeight: '100vh' }}>
      <Header>
        <div className='text-right bg-black text-sky-400'>
          <LoggedInUserContainer />
        </div>
        
      </Header>
      <Layout hasSider>
        <Sider
        theme='light'
        className='site-layout-background'
        collapsible
        collapsed={collapsed}
        onCollapse={() => setCollapsed(!collapsed)}
        style={{
          overflow: 'auto',
          height: 'calc(100vh - 64px)',
          position: 'relative',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="logo" />
        <MenuComponent pageLayouts={props.pageLayouts} />
      </Sider>
      
      <Layout  style={{display:'flex',flexDirection:'column',flex:'1 auto', overflowY:'scroll', height:'calc(100vh - 64px)'}}>

        <Outlet/>
      </Layout>
    </Layout>
  </Layout>  
  )
}