import { FC } from 'react';
import { UserListItemFieldsFragment } from '../generated';
import React from 'react';

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