import React, { FC } from 'react';
import PropTypes from 'prop-types';
import { Avatar , Button, Image} from 'antd';

const ComponentProps = {
  data: PropTypes.shape({
    profileImage: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    notificationCount: PropTypes.number,
  }),
  onLogoutClicked: PropTypes.func,
}

interface ComponentPropInterface {
  data: {
    profileImage?: string;
    firstName: string;
    lastName: string;
    notificationCount: number;
  },
  onLogoutClicked: () => void;
}

export type LoggedInPropTypes = PropTypes.InferProps<typeof ComponentProps> & ComponentPropInterface;

export const LoggedIn: FC<any> = (props) => {
  let initials = (props.data.firstName.charAt(0) + props.data.lastName.charAt(0)).toUpperCase();
  let profileImage = props.data.profileImage ? <Image src={props.data.profileImage} fallback="https://joeschmoe.io/api/v1/random"/> : <></>
  return <>
    <Avatar src={profileImage} style={{ backgroundColor: '#87d068' }}>{initials}</Avatar> {props.data.firstName} {props.data.lastName} 
    <Button onClick={props.onLogoutClicked}>Log Out</Button>
  </>
}
