import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import './account-layout.css';

import { MenuComponent } from './components/menu-component';

const { Footer, Sider } = Layout;

export const AccountLayout: React.FC<any> = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout hasSider style={{ minHeight: '100vh' }}>
        <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={() => setCollapsed(!collapsed)}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'relative',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="logo" />
        <MenuComponent pageLayouts={props.pageLayouts} />
      </Sider>
      
      <Layout className="site-layout" style={{display:'flex',flexDirection:'column',flex:'1 auto', overflowY:'scroll', height:'100vh'}}>

        <Outlet/>
      </Layout>
    </Layout>  
  )
}