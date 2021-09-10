import { FC } from 'react';
import { UserListItemFieldsFragment } from '../generated';
import React from 'react';
import PropTypes, { InferProps } from 'prop-types';

const ComponentPropTypes = {
  __typename: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  onClick: PropTypes.func,
}

export interface ComponentProp {
  onClick: () => void;
}

export type ComponentProps = InferProps<typeof ComponentPropTypes> & ComponentProp & UserListItemFieldsFragment;

export const UserListItem: FC<ComponentProps> = ({
  firstName,
  lastName,
  onClick,
}) => {
  
  return <>
    <div onClick={() => {onClick()}}>{firstName} {lastName}</div>
  </>  
}