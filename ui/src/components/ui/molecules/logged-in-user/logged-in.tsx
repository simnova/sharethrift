import React, { FC } from 'react';
import PropTypes from 'prop-types';
import { Avatar , Button} from 'antd';

const ComponentProps = {
  data: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    notificationCount: PropTypes.number,
  }),
  onLogoutClicked: PropTypes.func,
}

interface ComponentPropInterface {
  data: {
    firstName: string;
    lastName: string;
    notificationCount: number;
  },
  onLogoutClicked: () => void;
}

export type LoggedInPropTypes = PropTypes.InferProps<typeof ComponentProps> & ComponentPropInterface;

export const LoggedIn: FC<any> = (props) => {
  let initials = (props.data.firstName.charAt(0) + props.data.lastName.charAt(0)).toUpperCase();
  
  return <>
    <Avatar>{initials}</Avatar> {props.data.firstName} {props.data.lastName} 
    <Button onClick={props.onLogoutClicked}>Log Out</Button>
  </>
}
