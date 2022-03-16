import {Form, Input, Button, Table} from 'antd';
import { ListingCategorySelectionContainer } from './listing-category-selection-container';
import { ListingDraftTags } from './listing-draft-tags';
import { ListingDetailStatusHistory } from './listing-detail-status-history';
import { json } from 'stream/consumers';

export const ListingDetail: React.FC<any> = (props) => {
  const [form] = Form.useForm();
  return (
    <div>
    <Form
      layout='vertical'
      initialValues={props.data}
      form={form}
      onFinish={(values) => {
        props.onSave(values);
      }}
    >
      <Form.Item
        label="Title"
        name={['draft', 'title']}
        rules={[
          { required: true, message: 'Please input Title!' },
        ]}
      >
        <Input placeholder="Title" />
      </Form.Item>
      <Form.Item
        label="Description"
        name={['draft', 'description']}
        rules={[
          { required: true, message: 'Please input Description!' },
        ]}
      >
        <Input placeholder="Description" />
      </Form.Item>
      <Form.Item
        label="Primary Category"
        name={['draft', 'primaryCategory', 'id']}
        rules={[
          { required: true, message: 'Please select a Category!' },
        ]}
      >
        <ListingCategorySelectionContainer />
      </Form.Item>
      <Form.Item
        label="Tags"
        name={['draft', 'tags']}
      >
        <ListingDraftTags />
      </Form.Item>

      <Button type="primary" htmlType="submit">
        Update Listing
      </Button>
      <Button type="primary" onClick={props.onPublish}>
        Publish Listing
      </Button>
    </Form> 
    {JSON.stringify(props.data)}
    {props.data.draft.statusHistory ?(
      <>  <div>
        
    <ListingDetailStatusHistory data={props.data.draft.statusHistory} />
        </div>  
      </>
  
    ):(<></>)}
    </div>
  )
}