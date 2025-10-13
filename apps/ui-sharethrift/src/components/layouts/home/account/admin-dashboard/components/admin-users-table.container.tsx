import { useState } from "react";
import { AdminUsersTable } from "./admin-users-table.tsx";
import { ComponentQueryLoader } from "@sthrift/ui-components";
import type { AdminUserData } from "./admin-users-table.types.ts";
import { message } from "antd";

// TODO: Uncomment when backend is ready
// import { useQuery } from "@apollo/client";
// import { AdminUsersTableContainerAllUsersDocument } from "../../../../../generated.tsx";

export interface AdminUsersTableContainerProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function AdminUsersTableContainer({
  currentPage,
  onPageChange,
}: Readonly<AdminUsersTableContainerProps>) {
  const [searchText, setSearchText] = useState("");
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [sorter, setSorter] = useState<{
    field: string | null;
    order: "ascend" | "descend" | null;
  }>({ field: null, order: null });
  const pageSize = 50; // in BRD

  // TODO: Uncomment when backend GraphQL query is tested
  // const { data, loading, error } = useQuery(
  //   AdminUsersTableContainerAllUsersDocument,
  //   {
  //     variables: {
  //       page: currentPage,
  //       pageSize: pageSize,
  //       searchText: searchText,
  //       statusFilters: statusFilters,
  //       sorter:
  //         sorter.field && sorter.order
  //           ? { field: sorter.field, order: sorter.order }
  //           : undefined,
  //     },
  //     fetchPolicy: "network-only",
  //   }
  // );

  // TEMPORARY: Mock data for development
  const loading = false;
  const error = undefined;

  // Mock data - matches what the real query would return
  const data = {
    allUsers: {
      items: [
        {
          id: "1",
          username: "johndoe",
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          accountCreated: "2024-01-15T10:30:00Z",
          status: "Active" as const,
          isBlocked: false,
          userType: "verified-personal",
          reportCount: 0,
        },
        {
          id: "2",
          username: "janesmith",
          firstName: "Jane",
          lastName: "Smith",
          email: "jane@example.com",
          accountCreated: "2024-02-20T14:20:00Z",
          status: "Blocked" as const,
          isBlocked: true,
          userType: "verified-personal",
          reportCount: 2,
        },
        {
          id: "3",
          username: "bobbuilder",
          firstName: "Bob",
          lastName: "Builder",
          email: "bob@example.com",
          accountCreated: "2024-03-10T09:15:00Z",
          status: "Active" as const,
          isBlocked: false,
          userType: "verified-personal-plus",
          reportCount: 0,
        },
        {
          id: "4",
          username: "alicewonder",
          firstName: "Alice",
          lastName: "Wonder",
          email: "alice@example.com",
          accountCreated: "2024-04-05T16:45:00Z",
          status: "Active" as const,
          isBlocked: false,
          userType: "non-verified-personal",
          reportCount: 1,
        },
      ] as AdminUserData[],
      total: 4,
    },
  };

  const users = data?.allUsers?.items ?? [];
  const total = data?.allUsers?.total ?? 0;

  const handleSearch = (value: string) => {
    setSearchText(value);
    onPageChange(1); // Reset to first page on search
  };

  const handleStatusFilter = (checkedValues: string[]) => {
    setStatusFilters(checkedValues);
    onPageChange(1); // Reset to first page on filter change
  };

  const handleTableChange = (
    _pagination: unknown,
    _filters: unknown,
    sorterParam: unknown
  ) => {
    // Type guard: ensure sorterParam matches expected shape
    const sorter = sorterParam as {
      field?: string | string[];
      order?: "ascend" | "descend";
    };

    setSorter({
      field: Array.isArray(sorter.field)
        ? sorter.field[0] ?? null
        : sorter.field ?? null,
      order: sorter.order ?? null,
    });
  };

  const handleAction = (
    action: "block" | "unblock" | "view-profile" | "view-report",
    userId: string
  ) => {
    // TODO: Implement actual mutations for block/unblock
    console.log(`Action: ${action}, User ID: ${userId}`);

    switch (action) {
      case "block":
        message.info(`TODO: Implement block user mutation for user ${userId}`);
        // TODO: Call block mutation
        break;
      case "unblock":
        message.info(
          `TODO: Implement unblock user mutation for user ${userId}`
        );
        // TODO: Call unblock mutation
        break;
      case "view-profile":
        message.info(`TODO: Navigate to user profile for user ${userId}`);
        // TODO: Navigate to user profile page
        break;
      case "view-report":
        message.info(`TODO: Navigate to user reports for user ${userId}`);
        // TODO: Navigate to user reports page
        break;
    }
  };

  return (
    <ComponentQueryLoader
      loading={loading}
      hasData={data?.allUsers}
      error={error}
      hasDataComponent={
        <AdminUsersTable
          data={users}
          searchText={searchText}
          statusFilters={statusFilters}
          sorter={sorter}
          currentPage={currentPage}
          pageSize={pageSize}
          total={total}
          loading={loading}
          onSearch={handleSearch}
          onStatusFilter={handleStatusFilter}
          onTableChange={handleTableChange}
          onPageChange={onPageChange}
          onAction={handleAction}
        />
      }
    />
  );
}
