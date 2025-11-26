import { Row, Col, Button, Form, message } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useRef, useState, useEffect } from 'react';
import { SuccessPublished } from './create-listing-success.tsx';
import { SuccessDraft } from './create-draft-success.tsx';
import { ImageGallery } from './create-listing-image-gallery.tsx';
import { ListingForm } from './create-listing-form.tsx';
import '../view-listing/listing-image-gallery/listing-image-gallery.overrides.css';
import './create-listing.overrides.css';

// Date handling and detailed form controls live inside ListingForm component

export interface CreateListingFormData {
	title: string;
	description: string;
	category: string;
	location: string;
	sharingPeriod: [string, string];
	images: string[];
}

export interface CreateListingProps {
	categories: string[];
	isLoading: boolean;
	onSubmit: (data: CreateListingFormData, isDraft: boolean) => void;
	onCancel: () => void;
	uploadedImages: string[];
	onImageAdd: (imageUrl: string) => void;
	onImageRemove: (imageUrl: string) => void;
	onViewListing: () => void;
	onViewDraft: () => void;
	onModalClose: () => void;
}

export const CreateListing: React.FC<CreateListingProps> = ({
	categories,
	isLoading,
	onSubmit,
	onCancel,
	uploadedImages,
	onImageAdd,
	onImageRemove,
	onViewListing,
	onViewDraft,
	onModalClose,
}) => {
	const [form] = Form.useForm();
	const maxCharacters = 2000;
	const mainFileInputRef = useRef<HTMLInputElement>(null);
	const additionalFileInputRef = useRef<HTMLInputElement>(null);

	const handleFormSubmit = (isDraft: boolean) => {
		// If saving as draft, skip required-field validation and submit whatever the user has entered
		if (isDraft) {
			const values = form.getFieldsValue();

			// For drafts, provide default dates if not set
			const defaultStartDate = new Date();
			defaultStartDate.setDate(defaultStartDate.getDate() + 1); // Tomorrow
			const defaultEndDate = new Date();
			defaultEndDate.setDate(defaultEndDate.getDate() + 30); // 30 days from now

			const formData: CreateListingFormData = {
				title: values.title || '',
				description: values.description || '',
				category: values.category || '',
				location: values.location || '',
				sharingPeriod: values.sharingPeriod
					? [
							values.sharingPeriod[0]?.toISOString?.() ||
								defaultStartDate.toISOString(),
							values.sharingPeriod[1]?.toISOString?.() ||
								defaultEndDate.toISOString(),
						]
					: [defaultStartDate.toISOString(), defaultEndDate.toISOString()],
				images: uploadedImages,
			};

			// remember last action so we can show the draft modal when isLoading updates
			setLastAction('draft');
			onSubmit(formData, true);
			return;
		}

		// Publishing requires validation
		form
			.validateFields()
			.then((values) => {
				const formData: CreateListingFormData = {
					title: values.title,
					description: values.description,
					category: values.category,
					location: values.location,
					sharingPeriod: values.sharingPeriod
						? [
								values.sharingPeriod[0].toISOString(),
								values.sharingPeriod[1].toISOString(),
							]
						: ['', ''],
					images: uploadedImages,
				};
				// remember last action so we can show the appropriate modal when isLoading updates
				setLastAction('publish');
				onSubmit(formData, isDraft);
			})
			.catch((errorInfo) => {
				console.log('Validation failed:', errorInfo);
				if (!isDraft) {
					message.error('Please fill in all required fields to publish');
				}
			});
	};

	// Local UI state to manage modals (loading / success)
	const [lastAction, setLastAction] = useState<'none' | 'publish' | 'draft'>(
		'none',
	);
	const [localModal, setLocalModal] = useState<
		'none' | 'loading' | 'published' | 'draft'
	>('none');

	useEffect(() => {
		// When isLoading becomes true, show loading. When it becomes false, show appropriate success modal
		if (isLoading) {
			setLocalModal('loading');
		} else if (localModal === 'loading') {
			// transition from loading to result
			if (lastAction === 'publish') {
				setLocalModal('published');
			} else if (lastAction === 'draft') {
				setLocalModal('draft');
			} else {
				setLocalModal('none');
			}
		}
	}, [isLoading, localModal, lastAction]);

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
						onClick={onCancel}
					>
						Back
					</Button>
				</Col>
				<Col span={24} style={{ marginBottom: 0, paddingBottom: 0 }}>
					<div className="title42">Create a Listing</div>
				</Col>
				<Col
					span={24}
					style={{ marginTop: 0, paddingTop: 0, marginBottom: '32px' }}
				>
					<Form form={form} layout="vertical" requiredMark="optional">
						<Row
							gutter={0}
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
													message.error(
														'At least one image is required to publish the listing',
													);
													callback(
														'At least one image is required to publish the listing',
													);
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
								<ListingForm
									categories={categories}
									isLoading={isLoading}
									maxCharacters={maxCharacters}
									handleFormSubmit={handleFormSubmit}
									onCancel={onCancel}
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
			{/* Modals for success (loading shown inside modals) */}
			<SuccessPublished
				visible={
					localModal === 'published' ||
					(localModal === 'loading' && lastAction === 'publish')
				}
				loading={
					localModal === 'loading' && lastAction === 'publish'
						? isLoading
						: undefined
				}
				onClose={onModalClose}
				onViewListing={onViewListing}
			/>
			<SuccessDraft
				visible={
					localModal === 'draft' ||
					(localModal === 'loading' && lastAction === 'draft')
				}
				loading={
					localModal === 'loading' && lastAction === 'draft'
						? isLoading
						: undefined
				}
				onClose={onModalClose}
				onViewDraft={onViewDraft}
			/>
		</>
	);
}

// Render modals outside of main JSX so imports are used (component exports are within same file scope)
