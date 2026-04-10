import { useState } from "react";
import { AdminUsersTableContainer } from "./admin-users-table.container.tsx";


export const AdminUsers: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <AdminUsersTableContainer
      currentPage={currentPage}
      onPageChange={setCurrentPage}
    />
  );
}
