import React from "react";
import { Button } from "antd";

export interface ReservationActionButtonProps {
  action: "Cancel" | "Close" | "Message";
  onClick: () => void;
  loading?: boolean;
}

export const ReservationActionButton: React.FC<
  ReservationActionButtonProps
> = ({ action, onClick, loading = false }) => {
  return (
    <Button
      onClick={onClick}
      loading={loading}
      size="small"
      type="link"
    >
      {action}
    </Button>
  );
};

export default ReservationActionButton;
