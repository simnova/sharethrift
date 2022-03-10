import { Table, Form, Button} from "antd";
import { ColumnsType } from "antd/lib/table";
import { RoleSettings } from "./role-settings"
import { useState } from "react"
import { Role } from "../../../../generated";
export const AccountSettingsRoles: React.FC<any> = (props) => {
  const [selectedRole, setSelectedRole] = useState<Role|undefined>(undefined) ;
  
  
  const columns:ColumnsType<Role> = [
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
  const handleSetupNewRole = () => {
    setSelectedRole({
      roleName: "",
      isDefault: false,
      id: "",
      permissions : {
        listingPermissions: {
          canManageListings: false,
        },
        accountPermissions: {
          canManageAccountSettings: false,
          canManageRolesAndPermissions: false,
        }
      }
    });
  }
  const isNewRole = (selectedRole && selectedRole.id !== '')? false : true;
  const roleId = (isNewRole)? "" : selectedRole?.id;

  return (
    <div>
      <Button type="primary" onClick={handleSetupNewRole}>Add New Role</Button>
      <Table 
        rowSelection={{
          selectedRowKeys: selectedRole?[selectedRole!.id]:[],
          hideSelectAll: true,  
        }}
        columns={columns} 
        dataSource={props.data}
        rowKey={(record: any) => record.id}
        onRow={(record) => ({
          onClick: () => {
            console.log("clicked", JSON.stringify(record.id))
            //setSelectedRow([record.id])
            setSelectedRole(record)
          }
        })}
        
        />
      <RoleSettings data={selectedRole} key={selectedRole?selectedRole.id:''} onSave={isNewRole?props.onSave:props.onUpdate} />
    </div>
  )
}