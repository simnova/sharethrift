import { useMutation, useQuery } from "@apollo/client";
import { AccountSettingsContactsContainerAccountGetByHandleDocument, AccountSettingsContactsContainerAccountGetByHandleQuery } from "../../../../generated";
import { AccountSettingsContacts} from "./account-settings-contacts";
import { Skeleton } from "antd";

export const AccountSettingsContactsContainer: React.FC<any> = (props) => {
  const { data: accountData, loading: accountLoading, error: accountError } = useQuery(AccountSettingsContactsContainerAccountGetByHandleDocument,{
    variables: {
      handle: props.data.handle
    }
  });

  if(accountLoading) {
    return <div><Skeleton active /></div>
  }
  if(accountError) {
    return <div>{JSON.stringify(accountError)}</div>
  }
  if(accountData && accountData.accountGetByHandle) {
   // return <div>dfsfd</div>
    return <AccountSettingsContacts data={accountData.accountGetByHandle.contacts} />
  } else {
    return <div>No Data...</div>
  }
}