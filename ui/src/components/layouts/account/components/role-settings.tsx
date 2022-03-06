import { Form, Descriptions, Input, Button, Checkbox } from 'antd';

export const RoleSettings: React.FC<any> = (props) => {
  const [form] = Form.useForm();

  return  <>
    <h1>Profile</h1>
    <Descriptions size={'small'} layout={'vertical'}>
      <Descriptions.Item label="Id">{props.data.id}</Descriptions.Item>
      <Descriptions.Item label="Role">{props.data.roleName}</Descriptions.Item>
      <Descriptions.Item label="Is Default">{props.data.isDefault?"true":"false"}</Descriptions.Item>
    </Descriptions>
    <Form 
      layout="vertical"
      form={form}
      initialValues={props.data}
      onFinish={(values) => {
        props.onSave(values);
      }}
      >
      <h3>Listing Permissions</h3>
      <Form.Item 
        name={["permissions","listingPermissions","canManageListings"]}
        valuePropName="checked"
        >
        <Checkbox style={{ lineHeight: '32px' }} disabled={props.data.isDefault}>Can Manage Listings</Checkbox>
      </Form.Item>
      <h3>Accout Permissions</h3>
      <Form.Item 
        name={["permissions","accountPermissions","canManageRolesAndPermissions"]}
        valuePropName="checked"        
        > 
        <Checkbox style={{ lineHeight: '32px' }} disabled={props.data.isDefault}>Can Manage Roles and Permissions</Checkbox>
      </Form.Item>
      <Button type="primary" htmlType="submit" value={'save'}  disabled={props.data.isDefault}>
        Save
      </Button>
    </Form>
  </>
} 