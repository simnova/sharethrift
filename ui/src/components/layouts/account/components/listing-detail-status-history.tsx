import { Table } from "antd"
import dayjs from "dayjs"

export const ListingDetailStatusHistory: React.FC<any> = (props) => {
  const columns = [
   
    {
      title: "Status Code",
      dataIndex: "statusCode",
      key: "statusCode",
    },
    {
      title: "Detail",
      dataIndex: "statusDetail",  
      key: "statusDetail",
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