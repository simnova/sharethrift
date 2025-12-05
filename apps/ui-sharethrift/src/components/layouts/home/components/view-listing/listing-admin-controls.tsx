import { Button, Modal, Form, Select, Input, Alert, Col, message } from 'antd';
import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import type { ItemListing } from '../../../../../generated.tsx';
import {
	BlockListingDocument,
	UnblockListingDocument,
	ViewListingDocument,
} from '../../../../../generated.tsx';

const { TextArea } = Input;

const BLOCK_REASONS = [
	'Inappropriate Content',
	'Fraudulent Activity',
	'Terms Violation',
	'Safety Concerns',
	'Other',
];

interface ListingAdminControlsProps {
	listing: ItemListing;
	isBlocked: boolean;
}

export const ListingAdminControls: React.FC<ListingAdminControlsProps> = ({
	listing,
	isBlocked,
}) => {
	const [blockModalVisible, setBlockModalVisible] = useState(false);
	const [unblockModalVisible, setUnblockModalVisible] = useState(false);
	const [blockForm] = Form.useForm();

	const [blockListing, { loading: blockLoading }] = useMutation(BlockListingDocument, {
		refetchQueries: [
			{
				query: ViewListingDocument,
				variables: { id: listing.id }
			}
		],
		awaitRefetchQueries: true,
		onCompleted: () => {
			setBlockModalVisible(false);
			blockForm.resetFields();
			message.success('Listing blocked successfully');
		},
		onError: (error) => {
			console.error('Failed to block listing:', error);
			message.error('Failed to block listing. Please try again.');
		},
	});

	const [unblockListing, { loading: unblockLoading }] = useMutation(UnblockListingDocument, {
		refetchQueries: [
			{
				query: ViewListingDocument,
				variables: { id: listing.id }
			}
		],
		awaitRefetchQueries: true,
		onCompleted: () => {
			setUnblockModalVisible(false);
			message.success('Listing unblocked successfully');
		},
		onError: (error) => {
			console.error('Failed to unblock listing:', error);
			message.error('Failed to unblock listing. Please try again.');
		},
	});

	const handleBlockConfirm = async () => {
		try {
			await blockForm.validateFields();
			// Note: Block reason and description are validated but not currently persisted.
			// This ensures admins document their reasoning, and fields are ready for future
			// backend enhancement to store audit trail information.
			await blockListing({
				variables: { id: listing.id },
			});
		} catch (error: unknown) {
			// Only log validation errors since mutation errors are handled in onError
			if (error && typeof error === 'object' && 'errorFields' in error) {
				console.error('Block validation failed:', error);
				// Form validation errors are already displayed by antd Form
			}
		}
	};

	const handleUnblockConfirm = async () => {
		await unblockListing({
			variables: { id: listing.id },
		});
	};

	return (
		<>
			{/* Warning banner for blocked listings */}
			{isBlocked && (
				<Col span={24}>
					<Alert
						message="This listing is currently blocked"
						description="Only administrators can view blocked listings."
						type="warning"
						showIcon
					/>
				</Col>
			)}

			{/* Admin action buttons */}
			<Col span={24}>
				<div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
					{isBlocked ? (
						<Button
							type="primary"
							onClick={() => setUnblockModalVisible(true)}
							loading={unblockLoading}
						>
							Unblock Listing
						</Button>
					) : (
						<Button    
							type="primary"
							danger
							onClick={() => setBlockModalVisible(true)}
							loading={blockLoading}
						>
							Block Listing
						</Button>
					)}
				</div>
			</Col>

			{/* Block Listing Modal */}
			<Modal
				title="Block Listing"
				open={blockModalVisible}
				onOk={handleBlockConfirm}
				onCancel={() => {
					setBlockModalVisible(false);
					blockForm.resetFields();
				}}
				okText="Block"
				okButtonProps={{ danger: true, loading: blockLoading }}
			>
				<p style={{ marginBottom: 16 }}>
					You are about to block <strong>{listing.title}</strong>. This will prevent users from viewing or reserving this listing.
				</p>
				<Form form={blockForm} layout="vertical">
					<Form.Item
						name="reason"
						label="Reason for Block"
						rules={[{ required: true, message: 'Please select a reason' }]}
					>
						<Select placeholder="Select a reason">
							{BLOCK_REASONS.map((reason) => (
								<Select.Option key={reason} value={reason}>
									{reason}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item
						name="description"
						label="Description"
						rules={[
							{ required: true, message: 'Please provide a description' },
						]}
					>
						<TextArea
							rows={4}
							placeholder="Provide details about why this listing is being blocked"
							maxLength={1000}
						/>
					</Form.Item>
				</Form>
			</Modal>

			{/* Unblock Listing Modal */}
			<Modal
				title="Unblock Listing"
				open={unblockModalVisible}
				onOk={handleUnblockConfirm}
				onCancel={() => setUnblockModalVisible(false)}
				okText="Unblock"
				okButtonProps={{ loading: unblockLoading }}
			>
				<p>
					Are you sure you want to unblock <strong>{listing.title}</strong>?
				</p>
				<p style={{ color: '#666', fontSize: '14px' }}>
					This will restore the listing and allow users to view and reserve it again.
				</p>
			</Modal>
		</>
	);
};