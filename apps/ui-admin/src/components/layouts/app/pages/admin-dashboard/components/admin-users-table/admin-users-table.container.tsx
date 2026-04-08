import { useState } from "react";
import { AdminUsersTable } from "./admin-users-table.tsx";
import { ComponentQueryLoader } from "@sthrift/ui-components";
import { message } from "antd";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  AdminUsersTableContainerAllUsersDocument,
  BlockUserDocument,
  UnblockUserDocument,
} from "../../../../../../../generated.tsx";

interface AdminUsersTableContainerProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const AdminUsersTableContainer: React.FC<Readonly<AdminUsersTableContainerProps>> = ({
  currentPage,
  onPageChange,
}) => {
  const [searchText, setSearchText] = useState("");
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [sorter, setSorter] = useState<{
    field: string | null;
    order: "ascend" | "descend" | null;
  }>({ field: null, order: null });
  const pageSize = 50; // in BRD

  const { data, loading, error, refetch } = useQuery(
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

  const [blockUser] = useMutation(BlockUserDocument, {
    onCompleted: () => {
      message.success("User blocked successfully");
      refetch();
    },
    onError: (err) => {
      message.error(`Failed to block user: ${err.message}`);
    },
  });

  const [unblockUser] = useMutation(UnblockUserDocument, {
    onCompleted: () => {
      message.success("User unblocked successfully");
      refetch();
    },
    onError: (err) => {
      message.error(`Failed to unblock user: ${err.message}`);
    },
  });

  // Transform GraphQL data to match AdminUserData structure
  const users = (data?.allUsers?.items ?? []).map((user) => ({
    id: user.id,
    username: user.account?.username ?? "N/A",
    firstName: user.account?.profile?.firstName ?? "N/A",
    lastName: user.account?.profile?.lastName ?? "N/A",
    email: user.account?.email ?? "N/A",
    accountCreated: user.createdAt ?? "Unknown",
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

  const handleAction = async (
    action: "block" | "unblock" | "view-profile" | "view-report",
    userId: string
  ) => {
    console.log(`Action: ${action}, User ID: ${userId}`);

    switch (action) {
      case "block":
        try {
          await blockUser({ variables: { userId } });
        } catch (err) {
          // Error handled by mutation onError callback
          console.error("Block user error:", err);
        }
        break;
      case "unblock":
        try {
          await unblockUser({ variables: { userId } });
        } catch (err) {
          // Error handled by mutation onError callback
          console.error("Unblock user error:", err);
        }
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
