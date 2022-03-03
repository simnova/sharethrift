import React, { FC } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

const ComponentProps = {
  onLoginClicked: PropTypes.func,
  onSignupClicked: PropTypes.func,
}

interface ComponentPropInterface {
  onLoginClicked: () => void;
  onSignupClicked: () => void;
}

export type NotLoggedInPropTypes = PropTypes.InferProps<typeof ComponentProps> & ComponentPropInterface;

export const NotLoggedIn: FC<any> = (props) => {
  
  return <>
    <Button onClick={props.onLoginClicked}>Login</Button>
    <Button onClick={props.onSignupClicked}>Sign up</Button>
  </>
}
