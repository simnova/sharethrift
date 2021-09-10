import { FC,useState } from 'react';
import React from 'react';
import { UserList } from './user-list';
import { UserProfile } from './user-profile';
import { Row, Col, Divider } from 'antd';

export const Users: FC<any> = 
  ({props:any}) => {
  
  const [searchUserId, setSearchUserId] = useState<string>("6136f67e8a406fa7089defd7");
  
  return <>
    <Row>
      <Col span={12}>
        <UserList itemSelected={(userId:string) => setSearchUserId(userId)} /> 
      </Col>
      <Col span={12}>
        <UserProfile userId={searchUserId} />   
      </Col>
    </Row>
  </>
  
}