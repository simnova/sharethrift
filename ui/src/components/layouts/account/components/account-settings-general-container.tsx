import { useMutation, useQuery } from "@apollo/client";
import { AccountSettingsGeneralContainerAccountGetByHandleDocument,AccountSettingsGeneralContainerUpdateAccountDocument, AccountUpdateInput } from "../../../../generated";
import { AccountSettingsGeneral,  AccountSettingsGeneralPropTypes} from "./account-settings-general";
import PropTypes  from "prop-types";

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

  const handleSave = (values: AccountUpdateInput) => {
    values.id = accountData!.accountGetByHandle!.id;
    updateAccout({
      variables: {
        input:values
      }
    });
  }

  const content = () => {
    if(loading || accountLoading) {
      return <div>Loading...</div>
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