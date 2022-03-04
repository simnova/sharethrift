import React from 'react';
import { Routes, Route, Link, useLocation, matchRoutes } from 'react-router-dom';
import { Col, Menu, Row,  Layout, PageHeader } from 'antd';
import { BookOutlined, SettingOutlined } from '@ant-design/icons';

import { Grandchild1 } from './grandchild1';
import { Grandchild2 } from './grandchild2';

const { Header, Content } = Layout;

export const Child1: React.FC<any> = (props) => {
  const location = useLocation();

  const pages = [
    {id:1, path:'account/simple/1/grandchild1', title:'GrandChild1', icon:<BookOutlined />},
    {id:2, path:'account/simple/1/grandchild2', title:'GrandChild2', icon:<SettingOutlined />},
  ]

  var matchedPages = matchRoutes(pages,location)
  const matchedIds = matchedPages ? matchedPages.map((x:any) => x.route.id.toString()) : [];

  return (
    <>
      <Header className="site-layout-background" style={{ padding: 0 }}>
        <PageHeader
        title="Child1"
        />
      </Header>
      <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>

          <Row>
            <Col span={6}>
            <Menu mode="inline" selectedKeys={matchedIds}>
              <Menu.Item key="1">
                <Link to="grandchild1">Grandchild 1</Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="grandchild2">Grandchild 2</Link>
              </Menu.Item>
            </Menu>
            </Col>
            <Col span={18}>
              <Routes>
                <Route path="/grandchild1" element={<Grandchild1 />} />
                <Route path="/grandchild2" element={<Grandchild2 />} />
              </Routes>
            </Col>
          </Row>
        
        </div>
      </Content>
    </>
  )
}