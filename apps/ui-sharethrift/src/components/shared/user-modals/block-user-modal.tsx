import { Modal, Typography, Input, Form, Select } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

export interface BlockUserModalProps {
    visible: boolean;
    userName: string;
    onConfirm: ({ reason, description }: { reason: string; description: string }) => void;
    onCancel: () => void;
    loading?: boolean;
}

const BLOCK_REASONS = [
    "Late Return",
    "Item Damage",
    "Policy Violation",
    "Inappropriate Behavior",
    "Other",
];

// const BLOCK_DURATIONS = [
//     { label: "7 Days", value: "7" },
//     { label: "30 Days", value: "30" },
//     { label: "Indefinite", value: "indefinite" },
// ];

export const BlockUserModal: React.FC<Readonly<BlockUserModalProps>> = ({
    visible,
    userName,
    onConfirm,
    onCancel,
    loading = false,
}) => {
    const [blockForm] = Form.useForm();

    const handleOk = async () => {
        const values = await blockForm.validateFields();
        onConfirm(values);
        blockForm.resetFields();
    };

    const handleCancel = () => {
        blockForm.resetFields();
        onCancel();
    };

    return (
        <Modal
            title={
                <span>
                    <ExclamationCircleOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
                    Block User
                </span>
            }
            open={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Block"
            okButtonProps={{ danger: true, loading }}
            cancelButtonProps={{ disabled: loading }}
            width={500}
            maskClosable={!loading}
            closable={!loading}
        >
            <div style={{ marginTop: 16 }}>
                <Paragraph>
                    Are you sure you want to block <Text strong>{userName}</Text>?
                </Paragraph>

                <Paragraph type="secondary" style={{ fontSize: '14px' }}>
                    Blocking this user will prevent them from accessing the platform and
                    interacting with other users.
                </Paragraph>

                <Form form={blockForm} layout="vertical">
                    <Form.Item
                        name="reason"
                        label="Reason"
                        rules={[{ required: true, message: "Please select a reason" }]}
                    >
                        <Select placeholder="Select a reason">
                            {BLOCK_REASONS.map((reason) => (
                                <Select.Option key={reason} value={reason}>
                                    {reason}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    {/* <Form.Item
                        name="duration"
                        label="Block Duration"
                        rules={[{ required: true, message: "Please select a duration" }]}
                    >
                        <Select placeholder="Select duration">
                            {BLOCK_DURATIONS.map((duration) => (
                                <Select.Option key={duration.value} value={duration.value}>
                                    {duration.label}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item> */}
                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: "Please provide a description" }]}
                    >
                        <TextArea
                            rows={4}
                            placeholder="This message will be shown to the user"
                        />
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
};
