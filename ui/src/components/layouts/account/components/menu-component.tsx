import { Link, useLocation, matchRoutes, useParams, generatePath } from 'react-router-dom';
import { Menu, MenuTheme} from 'antd';
import { MenuMode } from 'rc-menu/lib/interface';

const { SubMenu } = Menu;

interface TextProp {
  pageLayouts: any;
  theme: MenuTheme | undefined;
  mode: MenuMode | undefined;
}

export const MenuComponent = ({ pageLayouts , ...props } : TextProp) => {
  const params = useParams();
  const location = useLocation();

  const createPath = (path:string):string => {
    return generatePath(path.replace('*',''),params)
  }

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
              <Link to={createPath(child.path)}>{child.title}</Link>
            </Menu.Item>
            {buildMenu(child.id)}
          </SubMenu> 
        :  
        <Menu.Item key={child.id} icon={child.icon}>
          <Link to={createPath(child.path)}>{child.title}</Link>
        </Menu.Item>
      )
    });
  }
   
  const topMenu = () => {
    const root = pageLayouts.find((x:any) => x.id === "ROOT") as any;
    const matchedPages = matchRoutes(pageLayouts,location)
    const matchedIds = matchedPages ? matchedPages.map((x:any) => x.route.id.toString()) : [];
    return (
      <Menu theme={props.theme} mode={props.mode} defaultSelectedKeys={matchedIds}>
        <Menu.Item key="home" icon={root.icon}>
          <Link to={createPath(root.path)}>{root.title}</Link>
        </Menu.Item>
        {buildMenu(root.id)}
      </Menu>
    )
  }
    
  return (topMenu());

}