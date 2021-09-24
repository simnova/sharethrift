import React, { FC } from 'react';
import { Row, Col, Button } from 'antd';
import { useMsal } from '../components/msal-react-lite';
import { RouteComponentProps } from "react-router";
import { withRouter } from 'react-router-dom';

const Login: FC<RouteComponentProps | any> = (props) => {
  const {login,getAuthToken} = useMsal();

  const loginAction = async (loginType:string) => {
    await login(loginType)
    var authToken = await getAuthToken(loginType);
    if (!(authToken === null || typeof authToken === "undefined")) {
      props.history.push({
        pathname: loginType === "admin" ? "/admin" : "/account"
      });
    }
  }

  return (
    <>
      <Row style={{"backgroundColor":"white"}}>
        <Col span={12}>
          <h3>Account Login</h3>
          <Button type="primary" onClick={() =>loginAction('account')}>Log In</Button>
        </Col>
        <Col span={12}>
          <h3>Admin Login</h3>
          <Button type="primary" onClick={() =>loginAction('admin')}>Log In</Button>
        </Col>
      </Row>
    </>
  )
}

export default withRouter(Login);