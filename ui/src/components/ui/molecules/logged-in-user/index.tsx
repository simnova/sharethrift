import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.module.css';

import { NotLoggedIn } from './not-logged-in';
import { LoggedIn,LoggedInPropTypes } from './logged-in';
const ComponentProps = {
  data: PropTypes.shape({
    isLoggedIn: PropTypes.bool.isRequired,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    notificationCount: PropTypes.number,
    profileImage: PropTypes.string,

  }),
  onLoginClicked: PropTypes.func,
  onSignupClicked: PropTypes.func,
  onLogoutClicked: PropTypes.func,
}

interface ComponentPropInterface {
  data: {
    isLoggedIn: boolean;
    firstName?: string;
    lastName?: string;
    notificationCount?: number;
    profileImage?: string;

  }    
  onLoginClicked?: () => void;
  onSignupClicked?: () => void;
  onLogoutClicked?: () => void;
}

export type LoggedInUserPropTypes = PropTypes.InferProps<typeof ComponentProps> & ComponentPropInterface;

export const LoggedInUser: React.FC<LoggedInUserPropTypes> = (props) => {
  const content = () => {
    const dummyFunction = () => {return };
    if(props.data.isLoggedIn) {

      const loggedInProps:Partial<LoggedInPropTypes> = {data:{
        profileImage: props.data.profileImage,
        firstName: props.data.firstName??'',
        lastName: props.data.lastName??'',
        notificationCount: props.data.notificationCount??0,}
      };

      return <>
        <LoggedIn 
          data={loggedInProps.data!}  
          onLogoutClicked={props.onLogoutClicked} />
      </>
    }else{
      return <>
        <NotLoggedIn 
          onLoginClicked={props.onLoginClicked??dummyFunction}
          onSignupClicked={props.onSignupClicked??dummyFunction} 
        />
      </>
    }
  }
  
  return <>
    <div className={styles['container']}>
      {content()}
    </div>
  </>

}