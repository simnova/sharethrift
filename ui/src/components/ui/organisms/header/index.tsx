import React from 'react';
import PropTypes from 'prop-types';
import { LoggedInUserContainer } from './logged-in-user-container';
import styles from './index.module.css';

/*
const ComponentProps = {

}

interface ComponentPropInterface {

}

export type HeaderPropTypes = PropTypes.InferProps<typeof ComponentProps> & ComponentPropInterface;
*/
export const Header: React.FC<any> = (props) => {
 
  
  return <>
    <div className={styles['top-bar']}>
      <LoggedInUserContainer />
    </div>
  </>

}