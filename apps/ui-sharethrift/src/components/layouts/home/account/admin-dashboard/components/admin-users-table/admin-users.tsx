import { useState } from "react";
import { AdminUsersTableContainer } from "./admin-users-table.container.tsx";

export interface AdminUsersProps {}

export const AdminUsers: React.FC<AdminUsersProps> = () => {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <AdminUsersTableContainer
      currentPage={currentPage}
      onPageChange={setCurrentPage}
    />
  );
}
