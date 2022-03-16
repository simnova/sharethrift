import {Input, Space} from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

const {Search} = Input;

export const SearchBox: React.FC<any> = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleSearch = (value:any) => {
    console.log(value);
    navigate(`/listings?search=${value}`);  
  }
  return (
    <Space direction="vertical" size="middle">
      <Search
        placeholder="What are you looking for?"
        onSearch={handleSearch}
        enterButton="Search"
      />
    </Space>
  )
}