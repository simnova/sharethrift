import React, {FC, ReactNode } from 'react';
import PropTypes, { InferProps } from 'prop-types';




export enum TitleSize {
  Title1  = 'title-1',
  Title2  = 'title-2',
  Title3  = 'title-3'
}

const ComponentPropTypes = {
  titleSize: PropTypes.oneOf(Object.values(TitleSize)),
  children: PropTypes.node,
}

interface ComponentProp {
  /**
  Sets button functionality based on the current user's logged in status.
  */
  titleSize?: TitleSize,
  children?: ReactNode
}

export type ComponentProps = InferProps<typeof ComponentPropTypes> & ComponentProp;

export const Title: FC<ComponentProps> = ({
  titleSize = TitleSize.Title1,
  children,
  }) => {
    return <>
      <div className={titleSize}>
        {children}
      </div>
    </>
}