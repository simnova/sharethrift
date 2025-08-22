import React from "react";
import { Tag } from "antd";

export interface ReservationStatusTagProps {
  status:
    | "REQUESTED"
    | "ACCEPTED"
    | "REJECTED"
    | "RESERVATION_PERIOD"
    | "CANCELLED";
}

const ReservationStatusTagColorMap = {
  REQUESTED: "blue",
  ACCEPTED: "green",
  REJECTED: "red",
  RESERVATION_PERIOD: "purple",
  CANCELLED: "default",
};

export const ReservationStatusTag: React.FC<ReservationStatusTagProps> = ({
  status,
}) => {
  const color = ReservationStatusTagColorMap[status];
  const statusTextFormatted = status   // Removes Underscores and Capitalizes First Letter of Each Word
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

  return <Tag color={color}>{statusTextFormatted}</Tag>;
};

export default ReservationStatusTag;
