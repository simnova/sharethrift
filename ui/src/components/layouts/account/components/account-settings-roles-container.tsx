import { useMutation, useQuery } from "@apollo/client";
import { AccountSettingsRolesContainerAccountGetByHandleDocument,AccountSettingsRolesContainerAccountGetByHandleQuery, AccountSettingsRolesContainerAccountAddRoleDocument, RoleAddInput, AccountSettingsRolesContainerAccountUpdateRoleDocument, RoleUpdateInput } from "../../../../generated";
import { AccountSettingsRoles} from "./account-settings-roles";
import { message, Skeleton } from "antd";

export const AccountSettingsRolesContainer: React.FC<any> = (props) => {
  const [addRole, { data, loading, error }] = useMutation(AccountSettingsRolesContainerAccountAddRoleDocument);  
  const [updateRole, { data:dataUpdate, loading:loadingUpdate, error:errorUpdate }] = useMutation(AccountSettingsRolesContainerAccountUpdateRoleDocument);  
  
  const { data: accountData, loading: accountLoading, error: accountError } = useQuery(AccountSettingsRolesContainerAccountGetByHandleDocument,{
    variables: {
      handle: props.data.handle
    }
  });

  const handleUpdate = async (values: RoleUpdateInput) => {   
    values.accountHandle = props.data.handle;
    try {
    await updateRole({
      variables: {
        input: values
      },
      refetchQueries: [
        {
          query: AccountSettingsRolesContainerAccountGetByHandleDocument,
          variables: {
            handle: props.data.handle
          }
        }
      ]
    });
    message.success("Role Updated");
    } catch (error) {
      message.error(`Error updating role: ${JSON.stringify(error)}`);
    }
  } 

  const handleSave = async (values: RoleAddInput) => {
    values.accountHandle = props.data.handle;
    try {
    addRole({
      variables: {
        input:values
      },
      refetchQueries: [
        {
          query: AccountSettingsRolesContainerAccountGetByHandleDocument,
          variables: {
            handle: props.data.handle
          }
        }
      ]
    });
    message.success("Role Added");
    } catch (error) {
      message.error(`Error adding role: ${JSON.stringify(error)}`);
    }
  }

  if(accountLoading) {
    return <div><Skeleton active /></div>
  }else if(accountError) {
    return <div>{JSON.stringify(accountError)}</div>
  }else if(accountData && accountData.accountGetByHandle) {
    return <AccountSettingsRoles data={accountData.accountGetByHandle.roles} onSave={handleSave} onUpdate={handleUpdate} />
  } else {
    return <div>No Data...</div>
  }

}