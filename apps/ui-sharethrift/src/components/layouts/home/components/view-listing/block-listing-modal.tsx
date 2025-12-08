import { Button, Form, Input, Modal } from 'antd';
import { useState } from 'react';

const { TextArea } = Input;

export interface BlockListingModalProps {
	visible: boolean;
	listingTitle: string;
	onConfirm: (reason: string, description: string) => void;
	onCancel: () => void;
	loading?: boolean;
}

export const BlockListingModal: React.FC<BlockListingModalProps> = ({
	visible,
	listingTitle,
	onConfirm,
	onCancel,
	loading = false,
}) => {
	const [form] = Form.useForm();
	const [charCount, setCharCount] = useState(0);
	const maxChars = 100;

	const handleOk = async () => {
		try {
			const values = await form.validateFields();
			onConfirm(values.reason, values.description);
			form.resetFields();
			setCharCount(0);
		} catch {
			// Validation failed
		}
	};

	const handleCancel = () => {
		form.resetFields();
		setCharCount(0);
		onCancel();
	};

	const handleDescriptionChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>,
	) => {
		setCharCount(e.target.value.length);
	};

	return (
		<Modal
			title="Block Listing"
			open={visible}
			onCancel={handleCancel}
			footer={[
				<Button key="cancel" onClick={handleCancel}>
					Cancel
				</Button>,
				<Button
					key="block"
					type="primary"
					danger
					onClick={handleOk}
					loading={loading}
				>
					Block
				</Button>,
			]}
		>
			<p style={{ marginBottom: 16 }}>
				You are about to block the listing: <strong>{listingTitle}</strong>
			</p>
			<Form form={form} layout="vertical">
				<Form.Item
					label="* Reason"
					name="reason"
					rules={[{ required: true, message: 'Please enter a reason' }]}
				>
					<Input placeholder="Enter reason for blocking" />
				</Form.Item>
				<Form.Item
					label="* Description"
					name="description"
					rules={[{ required: true, message: 'Please enter a description' }]}
				>
					<TextArea
						rows={4}
						placeholder="Enter description"
						maxLength={maxChars}
						onChange={handleDescriptionChange}
						showCount={{
							formatter: () => `${charCount} / ${maxChars}`,
						}}
					/>
				</Form.Item>
			</Form>
		</Modal>
	);
};
