import { Table } from "antd"
import dayjs from "dayjs"
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
      render: (text: any) => <span>{dayjs(text).format('DD/MM/YYYY')}</span>
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: any) => <span>{dayjs(text).format('DD/MM/YYYY')}</span>
    },
  ]

  return (
    <>
      <div>
        <Table 
          columns={columns} 
          dataSource={props.data} 
          rowKey={(record: any) => record.id}
          />
      </div>
    </>
  )
}