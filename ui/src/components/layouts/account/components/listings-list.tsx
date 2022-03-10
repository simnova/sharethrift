import { Table , Button} from "antd"
import dayjs from "dayjs"
import { useNavigate } from "react-router-dom"

export const ListingsList: React.FC<any> = (props) => {
  const navigate = useNavigate()
  const columns = [
    {
      title: "Action",
      dataIndex: "id",
      render: (text: any) => <Button type="primary" size="small" onClick={() => navigate(text)}>Edit</Button>
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Draft Title",
      dataIndex: ["draft", "title"],  
      key: "draftTitle",
    },
    {
      title: "Primary Category",
      dataIndex: ["primaryCategory", "name"],
      key: "primaryCategory",
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

  return (<>
    <div>
      <Table 
        columns={columns} 
        dataSource={props.data}
        rowKey={(record: any) => record.id}
      />
    </div>
  </>)
}