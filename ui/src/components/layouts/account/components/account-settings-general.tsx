import React from 'react';
import { Form,Input,Button,Descriptions } from 'antd';
import PropTypes from 'prop-types';

const ComponentPropTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    handle: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
}

interface ComponentPropInterface {
  data: {
    id: string;
    name: string;
    handle: string;
    createdAt: string;
    updatedAt: string;
  }
  onSave: (data: {
    id: string;
    name: string;
    handle: string;
    createdAt: string;
    updatedAt: string;
  }) => void;
}

export type AccountSettingsGeneralPropTypes = PropTypes.InferProps<typeof ComponentPropTypes> & ComponentPropInterface;

export const AccountSettingsGeneral: React.FC<AccountSettingsGeneralPropTypes> = (props) => {
  const [form] = Form.useForm();
  return (
    <>
      <Descriptions title="Account Info" size={'small'} layout={'vertical'}>
        <Descriptions.Item label="Id">{props.data.id}</Descriptions.Item>
        <Descriptions.Item label="Created At">{props.data.createdAt}</Descriptions.Item>
        <Descriptions.Item label="Updated At">{props.data.updatedAt}</Descriptions.Item>
      </Descriptions>
      <Form
        layout="vertical"
        form={form}
        initialValues={props.data}
        onFinish={(values) => {
          props.onSave(values);
        }}
        >
        <Form.Item
          name="name"
          label="Name"
          rules={[
            { required: true, message: 'Please input your name!' },
          ]}
        >
          <Input placeholder='Name' maxLength={200} />
        </Form.Item>
        <Form.Item
          name="handle"
          label="Handle"
          rules={[
            { required: true, message: 'Please input your handle!' },
          ]}
        >
          <Input placeholder='Handle' maxLength={50} />
        </Form.Item>
        <Button type="primary" htmlType="submit" value={'save'}>
          Save
        </Button>
      </Form>
    </>
  )
}