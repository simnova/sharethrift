import React, { FC } from 'react';
import { Row, Col, Button } from 'antd';
import { useMsal } from '../components/msal-react-lite';

const Login: FC<any> = (props) => {
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
  const createAccount = 
  `${process.env.REACT_APP_AAD_KNOWN_AUTHORITIES}&client_id=${process.env.REACT_APP_AAD_ACCOUNT_CLIENTID}&nonce=defaultNonce&redirect_uri=${encodeURIComponent(process.env.REACT_APP_AAD_REDIRECT_URI ?? '')}&scope=${encodeURIComponent(process.env.REACT_APP_AAD_ACCOUNT_SCOPES??'')}&response_type=id_token&option=signup`
  return (
    <>
      <Row style={{"backgroundColor":"white"}}>
        <a href={createAccount}>Create Account</a>
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

export default Login;