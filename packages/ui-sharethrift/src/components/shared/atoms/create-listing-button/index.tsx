import React from 'react';
import { Button } from 'antd';
import styles from './index.module.css';

export interface CreateListingButtonProps {
  onClick?: () => void;
}

export const CreateListingButton: React.FC<CreateListingButtonProps> = ({ onClick }) => {
  return (
    <Button
      className={styles.createListing}
      onClick={onClick}
      type="primary"
    >
      Create a Listing
    </Button>
  );
};