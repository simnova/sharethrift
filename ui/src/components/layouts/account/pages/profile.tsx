import { Form,Input,Button,Descriptions } from 'antd';
import PropTypes from 'prop-types';
import dayjs from "dayjs";

const ComponentPropTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
}

interface ComponentPropInterface {
  data: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    updatedAt: string;
  }
  onSave: (data: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    updatedAt: string;
  }) => void;
}

export type ProfilePropTypes = PropTypes.InferProps<typeof ComponentPropTypes> & ComponentPropInterface;

export const Profile: React.FC<any> = (props) => {
  const [form] = Form.useForm();
  
  return (
    <>

      <Form 
        layout="vertical"
        form={form}
        initialValues={props.data}
        onFinish={(values) => {
          props.onSave(values);
        }}
        >
        <Form.Item 
          name="firstName"
          label="First Name"
          rules={[
            { required: true, message: 'Please input your first name!' }
          ]}
          >
          <Input placeholder="First Name" maxLength={500} />
        </Form.Item>
        <Form.Item 
          name="lastName"
          label="Last Name"
          rules={[
            { required: true, message: 'Please input your last name!' }
          ]}
          >
          <Input placeholder="Last Name" maxLength={500}/>
        </Form.Item>
        <Button type="primary" htmlType="submit" value={'save'}>
          Save
        </Button>
      </Form>

    </>
  )
}