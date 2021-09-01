import React, {FC, ReactNode } from 'react';
import PropTypes, { InferProps } from 'prop-types';



const ComponentPropTypes = {
  isLoggedIn: PropTypes.bool.isRequired
}

interface ComponentProp {
  /**
  Sets header functionality based on the current user's logged in status.
  */
  isLoggedIn?: boolean
}

export type ComponentProps = InferProps<typeof ComponentPropTypes> & ComponentProp;

export const Header: FC<ComponentProps> = ({
  isLoggedIn
  }) => {
    return <>
      <div className="application-header">

        App Header!
      </div>
    </>
}