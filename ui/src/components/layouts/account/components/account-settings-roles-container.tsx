import { useMutation, useQuery } from "@apollo/client";
import { AccountSettingsRolesContainerAccountGetByHandleDocument } from "../../../../generated";
import { AccountSettingsRoles} from "./account-settings-roles";

export const AccountSettingsRolesContainer: React.FC<any> = (props) => {
  const { data: accountData, loading: accountLoading, error: accountError } = useQuery(AccountSettingsRolesContainerAccountGetByHandleDocument,{
    variables: {
      handle: props.data.handle
    }
  });

  if(accountLoading) {
    return <div>Loading...</div>
  }
  if(accountError) {
    return <div>{JSON.stringify(accountError)}</div>
  }
  if(accountData && accountData.accountGetByHandle) {
   // return <div>dfsfd</div>
    return <AccountSettingsRoles data={accountData.accountGetByHandle.roles} />
  } else {
    return <div>No Data...</div>
  }
}