import { Button, Input, Form} from "antd";
import ListBody from "antd/lib/transfer/ListBody";
import { HashRouter, Route, Routes, Link, useLocation, matchRoutes } from 'react-router-dom';
import { Breadcrumb, Alert } from 'antd';

import { Menu } from 'antd';
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;

interface TextProp {
  pageLayouts: any;
}


export const MenuComponent = ({ pageLayouts , ...props } : TextProp) => {

  const location = useLocation();


  const buildMenu = (parentId:string) => {
    const children = pageLayouts.filter((x:any) => x.parent === parentId);
    if(!children) { return; }
    return children.map((x:any) => {
      let child = pageLayouts.find((y:any) => y.id === x.id) as any
      let grandChildren = pageLayouts.filter((x:any) => x.parent === child.id)
      return (
        (grandChildren && grandChildren.length > 0 )? 
          <SubMenu key={child.id} title={child.title}>
            <Menu.Item key={`${child.id}-link`} icon={child.icon}>
              <Link to={child.path.replace('*','')}>{child.title} - {child.id}</Link>
            </Menu.Item>
            {buildMenu(child.id)}
          </SubMenu> 
        :  
        <Menu.Item key={child.id} icon={child.icon}>
          <Link to={child.path.replace('*','')}>{child.title} - {child.id}</Link>
        </Menu.Item>
      )
    });
  }
   
  const topMenu = () => {
    const root = pageLayouts.find((x:any) => x.parent === "ROOT") as any;
    const matchedPages = matchRoutes(pageLayouts,location)
    const matchedIds = matchedPages ? matchedPages.map((x:any) => x.route.id.toString()) : [];
    const rootPage = pageLayouts.find((x:any) => x.parent === "ROOT") ?? {};
    return (
      <Menu theme="dark" mode="inline" defaultSelectedKeys={matchedIds}>
        <Menu.Item key="home" icon={root.icon}>
          <Link to={root.path.replace('*','')}>{root.title}</Link>
        </Menu.Item>
        {buildMenu(root.id)}

      </Menu>
    )
  }
    

  return (topMenu());
}