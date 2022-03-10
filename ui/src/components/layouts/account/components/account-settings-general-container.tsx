import { useMutation, useQuery } from "@apollo/client";
import { AccountSettingsGeneralContainerAccountGetByHandleDocument,AccountSettingsGeneralContainerUpdateAccountDocument, AccountUpdateInput } from "../../../../generated";
import { AccountSettingsGeneral,  AccountSettingsGeneralPropTypes} from "./account-settings-general";
import PropTypes  from "prop-types";
import { message,Skeleton } from "antd";
import { SubPageLayout } from "../sub-page-layout";

const ComponentPropTypes = {
  data: PropTypes.shape({
    handle: PropTypes.string.isRequired
  }),
}

interface ComponentPropInterface {
  data: {
    handle: string;
  }
}

export type AccountSettingsGeneralContainerPropTypes = PropTypes.InferProps<typeof ComponentPropTypes> & ComponentPropInterface;

export const AccountSettingsGeneralContainer: React.FC<AccountSettingsGeneralContainerPropTypes> = (props) => {
  const [updateAccout, { data, loading, error }] = useMutation(AccountSettingsGeneralContainerUpdateAccountDocument);  
  const { data: accountData, loading: accountLoading, error: accountError } = useQuery(AccountSettingsGeneralContainerAccountGetByHandleDocument,{
      variables: {
        handle: props.data.handle
      }
    });

  const handleSave = async (values: AccountUpdateInput) => {
    values.id = accountData!.accountGetByHandle!.id;
    try {
      await updateAccout({
        variables: {
          input:values
        },
        refetchQueries: [
          {
            query: AccountSettingsGeneralContainerAccountGetByHandleDocument,
            variables: {
              handle: props.data.handle
            }
          }
        ]
      });
      message.success("Saved");
    } catch (error) {
      message.error(`Error updating user: ${JSON.stringify(error)}`);
    }

  }

  const content = () => {
    if(accountLoading) {
      return <div><Skeleton active /></div>
    } else if(error || accountError) {
      return <div>{error}{accountError}</div>
    } else if(accountData && accountData.accountGetByHandle) {
      return <AccountSettingsGeneral onSave={handleSave} data={accountData?.accountGetByHandle as AccountSettingsGeneralPropTypes["data"]} />
    } else {
      return <div>No Data...</div>
    }
  }

  return <>
    {content()}
  </>
  
}