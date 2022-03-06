import { Table, Form } from "antd"
import { RoleSettings } from "./role-settings"
export const AccountSettingsRoles: React.FC<any> = (props) => {

  const columns = [
    {
      title: "Role",
      dataIndex: "roleName",
      key: "roleName",
      
    },
    {
      title: "Is Default",
      dataIndex: "isDefault",
      key: "isDefault",
      render: (text: any) => <span>{text?"true":"false"}</span>
    }
    
  ]
  return (<>
  {JSON.stringify(props)}
  <Table columns={columns} dataSource={props.data} />

  <RoleSettings data={props.data[0]}  />

  </>
  )
}