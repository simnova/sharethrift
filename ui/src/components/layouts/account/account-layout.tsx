import React from "react";
import { Link, Outlet } from "react-router-dom"
import { Layout, Menu } from 'antd';
import './account-layout.css';
import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  ShopOutlined,
  TeamOutlined,
  UserOutlined,
  UploadOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { MenuComponent } from "./components/menu-component";

const { Header, Content, Footer, Sider } = Layout;


export const AccountLayout: React.FC<any> = (props) => {
  return (
    <Layout hasSider>
      <Sider
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="logo" />
        <MenuComponent pageLayouts={props.pageLayouts} />
      </Sider>
      <Layout className="site-layout" style={{ marginLeft: 200 }}>
        <Header className="site-layout-background" style={{ padding: 0 }}>
          <h1>Admin</h1>
        </Header>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div className="site-layout-background" style={{ padding: 24, textAlign: 'center' }}>
            <Outlet/>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Open Source</Footer>
      </Layout>
    </Layout>  
  )
}