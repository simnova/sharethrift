import React, { FC } from 'react';
import { UserListItemFieldsFragment } from '../generated';

export interface ComponentProp {
  onClick: () => void;
}

export type ComponentProps =  ComponentProp & UserListItemFieldsFragment;

export const UserListItem: FC<ComponentProps> = ({
  firstName,
  lastName,
  onClick,
}) => {
  
  return <>
    <div onClick={() => {onClick()}}>{firstName} {lastName}</div>
  </>  
}