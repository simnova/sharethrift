import { Table } from "antd"
export const AccountSettingsContacts: React.FC<any> = (props) => {
  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Role",
      dataIndex: ["role", "roleName"],
      key: "role",
    },
    {
      title: "Updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
    },
  ]

  return (
    <>
      <div>
        <Table columns={columns} dataSource={props.data} />
      </div>
    </>
  )
}