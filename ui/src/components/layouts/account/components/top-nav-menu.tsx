import React, { useState } from 'react';
import { Link} from 'react-router-dom';
import { Menu } from 'antd';


export const TopNavMenu: React.FC<any> = (props) => {
  
    const [selected, setSelected] = useState('');
  
    const handleClick = (e: any) => {
      setSelected(e.key);
    }
  
    return (
      <Menu
        onClick={handleClick}
        selectedKeys={[selected]}
        theme="light"
      >
        <Menu.Item key="1">
          <Link to="/account/simple/1/grandchild1">Grandchild 1</Link>
        
        </Menu.Item>
    </Menu>
    )
  }