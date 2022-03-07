import {Form, Input, Button} from 'antd';
import { ListingCategorySelectionContainer } from './listing-category-selection-container';

export const ListingCreate: React.FC<any> = (props) => {
  const [form] = Form.useForm();
  return (
    <Form
      layout='vertical'
      form={form}
      onFinish={(values) => {
        props.onSave(values);
      }}
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[
          { required: true, message: 'Please input Title!' },
        ]}
      >
        <Input placeholder="Title" />
      </Form.Item>
      <Form.Item
        label="Description"
        name="description"
        rules={[
          { required: true, message: 'Please input Description!' },
        ]}
      >
        <Input placeholder="Description" />
      </Form.Item>
      <Form.Item
        label="Primary Category"
        name="primaryCategory"
        rules={[
          { required: true, message: 'Please select a Category!' },
        ]}
      >
        <ListingCategorySelectionContainer />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Create Listing
      </Button>
    </Form> 
  )
}