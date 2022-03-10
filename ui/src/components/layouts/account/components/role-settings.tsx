import { Form, Descriptions, Input, Button, Checkbox } from 'antd';

export const RoleSettings: React.FC<any> = (props) => {
  const [form] = Form.useForm();
  if(!props.data) {
    return <div></div>
  }
  return  <>
    <h1>Profile</h1>
    <Descriptions size={'small'} layout={'vertical'}>
      <Descriptions.Item label="Id">{props.data?.id?(props.data!.id):"New Role"}</Descriptions.Item>
      <Descriptions.Item label="Is Default">{props.data?(props.data!.isDefault?"true":"false"):"false"}</Descriptions.Item>
    </Descriptions>
    <Form 
      layout="vertical"
      form={form}
      initialValues={props.data}
      onFinish={(values) => {
        if(props.data?.id){values.id = props.data!.id};
        props.onSave(values);
      }}
      >
      <Form.Item 
        name={["roleName"]}
        >
        <Input placeholder='Role Name' maxLength={50} disabled={props.data.isDefault} />
      </Form.Item>
      <h3>Listing Permissions</h3>
      <Form.Item 
        name={["permissions","listingPermissions","canManageListings"]}
        valuePropName="checked"
        >
        <Checkbox style={{ lineHeight: '32px' }} disabled={props.data.isDefault}>Can Manage Listings</Checkbox>
      </Form.Item>
      <h3>Account Permissions</h3>
      <Form.Item 
        name={["permissions","accountPermissions","canManageRolesAndPermissions"]}
        valuePropName="checked"        
        > 
        <Checkbox style={{ lineHeight: '32px' }} disabled={props.data.isDefault}>Can Manage Roles and Permissions</Checkbox>
      </Form.Item>
      <Form.Item 
        name={["permissions","accountPermissions","canManageAccountSettings"]}
        valuePropName="checked"        
        > 
        <Checkbox style={{ lineHeight: '32px' }} disabled={props.data.isDefault}>Can Manage Account Settings</Checkbox>
      </Form.Item>
      <Button type="primary" htmlType="submit" value={'save'}  disabled={props.data.isDefault}>
        Save
      </Button>
    </Form>
  </>
} 