import { Modal, Typography } from 'antd';

const { Text, Paragraph } = Typography;

interface UnblockUserModalProps {
    visible: boolean;
    userName: string;
    blockReason?: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
}

export const UnblockUserModal: React.FC<Readonly<UnblockUserModalProps>> = ({
    visible,
    userName,
    blockReason,
    onConfirm,
    onCancel,
    loading = false,
}) => {
    return (
        <Modal
            title={
                <span>
                    Unblock User
                </span>
            }
            open={visible}
            onOk={onConfirm}
            onCancel={onCancel}
            okText="Unblock"
            okButtonProps={{ type: 'primary', loading }}
            cancelButtonProps={{ disabled: loading }}
            width={500}
            maskClosable={!loading}
            closable={!loading}
        >
            <div style={{ marginTop: 16 }}>
                <Paragraph>
                    Are you sure you want to unblock <Text strong>{userName}</Text>?
                </Paragraph>
                <Paragraph type="secondary" style={{ fontSize: '14px' }}>
                    Unblocking this user will restore their access to the platform and allow
                    them to interact with other users again.
                </Paragraph>
                {blockReason && (
                    <div
                        style={{
                            marginTop: 16,
                            padding: 12,
                            background: '#f5f5f5',
                            borderRadius: 4,
                        }}
                    >
                        <Text strong>Original block reason:</Text>
                        <Paragraph style={{ marginTop: 8, marginBottom: 0 }}>
                            {blockReason}
                        </Paragraph>
                    </div>
                )}
            </div>
        </Modal>
    );
};
