import { useState } from "react";
import { AdminUsersTable } from "./admin-users-table.tsx";
import { ComponentQueryLoader } from "@sthrift/ui-components";
import { message } from "antd";

import { useQuery } from "@apollo/client";
import { AdminUsersTableContainerAllUsersDocument } from "../../../../../../generated.tsx";

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

  const { data, loading, error } = useQuery(
    AdminUsersTableContainerAllUsersDocument,
    {
      variables: {
        page: currentPage,
        pageSize: pageSize,
        searchText: searchText,
        statusFilters: statusFilters,
        sorter:
          sorter.field && sorter.order
            ? { field: sorter.field, order: sorter.order }
            : undefined,
      },
      fetchPolicy: "network-only",
    }
  );

  // Transform GraphQL data to match AdminUserData structure
  const users = (data?.allUsers?.items ?? []).map((user) => ({
    id: user.id,
    username: user.account?.username ?? "N/A",
    firstName: user.account?.profile?.firstName ?? "N/A",
    lastName: user.account?.profile?.lastName ?? "N/A",
    email: user.account?.email ?? "N/A",
    accountCreated: user.createdAt ?? new Date().toISOString(),
    status: user.isBlocked ? ("Blocked" as const) : ("Active" as const),
    isBlocked: user.isBlocked ?? false,
    userType: user.userType ?? "unknown",
    reportCount: 0, // TODO: Add reportCount to GraphQL query once available
  }));
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
