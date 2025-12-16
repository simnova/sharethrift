import { Row, Col, Button, Form, Modal } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useRef, useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { ImageGallery } from '../create-listing/create-listing-image-gallery.tsx';
import { EditListingForm } from './edit-listing-form.tsx';
import '../view-listing/listing-image-gallery/listing-image-gallery.overrides.css';
import '../create-listing/create-listing.overrides.css';
import type { EditListingItemListingFieldsFragment } from '../../../../../generated.tsx';

export interface EditListingFormData {
	title: string;
	description: string;
	category: string;
	location: string;
	sharingPeriod: [string, string];
	images: string[];
}

export interface EditListingProps {
	listing: EditListingItemListingFieldsFragment;
	categories: string[];
	isLoading: boolean;
	onSubmit: (data: EditListingFormData) => void;
	onPause: () => void;
	onDelete: () => void;
	onCancel: () => void;
	onNavigateBack: () => void;
	uploadedImages: string[];
	onImageAdd: (imageUrl: string) => void;
	onImageRemove: (imageUrl: string) => void;
}

export const EditListing: React.FC<EditListingProps> = ({
	listing,
	categories,
	isLoading,
	onSubmit,
	onPause,
	onDelete,
	onCancel,
	onNavigateBack,
	uploadedImages,
	onImageAdd,
	onImageRemove,
}) => {
	const [form] = Form.useForm();
	const maxCharacters = 2000;
	const mainFileInputRef = useRef<HTMLInputElement>(null);
	const additionalFileInputRef = useRef<HTMLInputElement>(null);
	const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
	const [isPauseModalVisible, setIsPauseModalVisible] = useState(false);
	const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);

	// Initialize form with listing data
	useEffect(() => {
		if (listing) {
			form.setFieldsValue({
				title: listing.title,
				description: listing.description,
				category: listing.category,
				location: listing.location,
				sharingPeriod: [
					dayjs(listing.sharingPeriodStart),
					dayjs(listing.sharingPeriodEnd),
				],
			});
		}
	}, [listing, form]);

	const formatDateOnly = (value?: {
		format?: (pattern: string) => string;
		toISOString?: () => string;
	}) =>
		value?.format?.('YYYY-MM-DD') ?? value?.toISOString?.().slice(0, 10) ?? '';

	const handleFormSubmit = () => {
		form
			.validateFields()
			.then((values) => {
				const formData: EditListingFormData = {
					title: values.title,
					description: values.description,
					category: values.category,
					location: values.location,
					sharingPeriod: values.sharingPeriod
						? [
								formatDateOnly(values.sharingPeriod[0]),
								formatDateOnly(values.sharingPeriod[1]),
							]
						: ['', ''],
					images: uploadedImages,
				};
				onSubmit(formData);
			})
			.catch((errorInfo) => {
				console.log('Validation failed:', errorInfo);
			});
	};

	const handleDeleteConfirm = () => {
		setIsDeleteModalVisible(false);
		onDelete();
	};

	const handlePauseConfirm = () => {
		setIsPauseModalVisible(false);
		onPause();
	};

	const handleCancelConfirm = () => {
		setIsCancelModalVisible(false);
		onCancel();
	};

	const canPause = listing.state === 'Published';
	const canCancel = ['Published', 'Drafted', 'Paused'].includes(
		listing.state || '',
	);

	return (
		<>
			<Row
				style={{
					paddingLeft: 100,
					paddingRight: 100,
					paddingTop: 50,
					paddingBottom: 75,
					boxSizing: 'border-box',
					width: '100%',
				}}
				gutter={[0, 24]}
				className="create-listing-responsive"
			>
				{/* Header */}
				<Col span={24} style={{ marginBottom: 0, paddingBottom: 0 }}>
					<Button
						className="primaryButton"
						type="primary"
						icon={<LeftOutlined />}
						onClick={onNavigateBack}
						disabled={isLoading}
					>
						Back
					</Button>
				</Col>
				<Col span={24} style={{ marginBottom: 0, paddingBottom: 0 }}>
					<div className="title42">Edit Listing</div>
				</Col>
				<Col
					span={24}
					style={{ marginTop: 0, paddingTop: 0, marginBottom: '32px' }}
				>
					<Form form={form} layout="vertical" requiredMark="optional">
						<Row
							gutter={[48, 32]}
							align="top"
							style={{ marginTop: 0, paddingTop: 0 }}
							className="create-listing-main-responsive"
						>
							<Col
								xs={24}
								md={12}
								className="image-col"
								style={{
									display: 'flex',
									alignItems: 'flex-start',
									justifyContent: 'center',
									marginTop: 0,
									paddingTop: 0,
								}}
							>
								<Form.Item
									name="images"
									rules={[
										{
											validator: (_rule, _value, callback) => {
												if (uploadedImages.length === 0) {
													callback('At least one image is required');
												} else {
													callback();
												}
											},
										},
									]}
									style={{
										width: '100%',
										marginLeft: 'auto',
										marginRight: 'auto',
										marginBottom: 0,
									}}
								>
									<ImageGallery
										uploadedImages={uploadedImages}
										onImageRemove={onImageRemove}
										mainFileInputRef={mainFileInputRef}
										additionalFileInputRef={additionalFileInputRef}
									/>
								</Form.Item>
							</Col>

							{/* Right Column - Form */}
							<Col
								xs={24}
								md={12}
								className="form-col"
								style={{ marginTop: 0, paddingTop: 0 }}
							>
								<EditListingForm
									categories={categories}
									isLoading={isLoading}
									maxCharacters={maxCharacters}
									handleFormSubmit={handleFormSubmit}
									onNavigateBack={onNavigateBack}
									onPause={() => setIsPauseModalVisible(true)}
									onDelete={() => setIsDeleteModalVisible(true)}
									onCancel={() => setIsCancelModalVisible(true)}
									canPause={canPause}
									canCancel={canCancel}
								/>
							</Col>
						</Row>
					</Form>
				</Col>
			</Row>

			{/* Hidden file inputs */}
			<input
				ref={mainFileInputRef}
				type="file"
				accept="image/*"
				multiple
				onChange={(e) => {
					const files = Array.from(e.target.files || []);
					files.forEach((file) => {
						const reader = new FileReader();
						reader.onload = () => {
							const result = reader.result as string;
							onImageAdd(result);
						};
						reader.readAsDataURL(file);
					});
					e.target.value = '';
				}}
				style={{ display: 'none' }}
			/>
			<input
				ref={additionalFileInputRef}
				type="file"
				accept="image/*"
				multiple
				onChange={(e) => {
					const files = Array.from(e.target.files || []);
					files.forEach((file) => {
						const reader = new FileReader();
						reader.onload = () => {
							const result = reader.result as string;
							onImageAdd(result);
						};
						reader.readAsDataURL(file);
					});
					e.target.value = '';
				}}
				style={{ display: 'none' }}
			/>

			{/* Delete Confirmation Modal */}
			<Modal
				title="Delete Listing"
				open={isDeleteModalVisible}
				onOk={handleDeleteConfirm}
				onCancel={() => setIsDeleteModalVisible(false)}
				okText="Delete"
				okButtonProps={{ danger: true }}
			>
				<p>
					Are you sure you want to delete this listing? This action cannot be
					undone.
				</p>
			</Modal>

			{/* Pause Confirmation Modal */}
			<Modal
				title="Pause Listing"
				open={isPauseModalVisible}
				onOk={handlePauseConfirm}
				onCancel={() => setIsPauseModalVisible(false)}
				okText="Pause"
			>
				<p>
					Are you sure you want to pause this listing? It will no longer be
					visible to other users.
				</p>
			</Modal>

			{/* Cancel Confirmation Modal */}
			<Modal
				title="Cancel Listing"
				open={isCancelModalVisible}
				onOk={handleCancelConfirm}
				onCancel={() => setIsCancelModalVisible(false)}
				okText="Cancel Listing"
				okButtonProps={{ danger: true }}
			>
				<p>
					Are you sure you want to cancel this listing? This will move it to a
					cancelled state.
				</p>
			</Modal>
		</>
	);
};
