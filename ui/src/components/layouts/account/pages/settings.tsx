import React from 'react';
import { Routes, Route, Link, useLocation, matchRoutes } from 'react-router-dom';
import { Col, Menu, Row,  Layout, PageHeader } from 'antd';
import { BookOutlined, SettingOutlined, UserOutlined, TeamOutlined, SafetyOutlined, ProfileOutlined, IdcardOutlined } from '@ant-design/icons';

import { General } from './settings-general';
import { Contacts } from './settings-contacts';
import { Roles } from './settings-roles';

const { Header, Content } = Layout;

export const Settings: React.FC<any> = (props) => {
  const location = useLocation();

  const pages = [
    {id:1, path:'account/:handle/settings/', title:'General', icon:<BookOutlined />},
    {id:2, path:'account/:handle/settings/contacts', title:'Contacts', icon:<SettingOutlined />},
    {id:3, path:'account/:handle/settings/roles', title:'Roles', icon:<SettingOutlined />},
  ]

  var matchedPages = matchRoutes(pages,location)
  const matchedIds = matchedPages ? matchedPages.map((x:any) => x.route.id.toString()) : [];

  return (
    <>
      <Header className="site-layout-background" style={{ padding: 0 }}>
        <PageHeader
        title="Account Settings"
        />
      </Header>
      <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>

          <Row>
            <Col span={6}>
            <Menu mode="inline" selectedKeys={matchedIds}>
              <Menu.Item key="1" icon={<ProfileOutlined />}>
                <Link to="">General</Link>
              </Menu.Item>
              <Menu.Item key="2" icon={<TeamOutlined />}>
                <Link to="contacts">Contacts</Link>
              </Menu.Item>
              <Menu.Item key="3" icon={<SafetyOutlined />}>
                <Link to="roles">Roles</Link>
              </Menu.Item>
            </Menu>
            </Col>
            <Col span={18} style={{paddingLeft:'24px'}}>
              <Routes>
                <Route path="" element={<General />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/roles" element={<Roles />} />
              </Routes>
            </Col>
          </Row>
        
        </div>
      </Content>
    </>
  )
}