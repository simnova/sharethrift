import {  Button } from 'antd';
import { Link , useLocation, matchRoutes, useNavigate} from 'react-router-dom';

export interface AccountSelectorProps {
  data: {
    accounts: {
      id: string,
      name?: string,
      handle?: string
    }[]
  }
}

export const AccountSelector:React.FC<AccountSelectorProps> = (props) => {
  const navigate = useNavigate();

  const AccountList = () => { 
    let accountListElements:JSX.Element[] = [];
    accountListElements = props.data.accounts.map((account) => { return(<Button block key={account.id} onClick={() => navigate(`/account/${account?.handle}/`)}>{account.name??''}</Button>);})
    return accountListElements
  }



  return(
    <div className='mx-auto max-w-[300px] mt-[100px] rounded-lg'>
    <h3 className='text-center'>Select an account to continue</h3>
    { props.data.accounts.length}
    {AccountList()}
    </div>
  )
}