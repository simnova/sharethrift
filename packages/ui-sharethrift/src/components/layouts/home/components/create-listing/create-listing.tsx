import {
	Row,
	Col,
	Button,
	Form,
	Input,
	Select,
	DatePicker,
	Space,
	message,
} from 'antd';
import { PlusOutlined, LeftOutlined, CloseOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import { useRef, useState, useEffect } from 'react';
import { SuccessPublished } from './screens/success-published';
import { SuccessDraft } from './screens/success-draft';
import '../view-listing/listing-image-gallery/listing-image-gallery.overrides.css';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

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
}

export function CreateListing({
	categories,
	isLoading,
	onSubmit,
	onCancel,
	uploadedImages,
	onImageAdd,
	onImageRemove,
}: CreateListingProps) {
	const [form] = Form.useForm();
	const maxCharacters = 2000;
	const mainFileInputRef = useRef<HTMLInputElement>(null);
	const additionalFileInputRef = useRef<HTMLInputElement>(null);

	const handleFormSubmit = (isDraft: boolean) => {
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
				setLastAction(isDraft ? 'draft' : 'publish');
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

	const disabledDate = (current: Dayjs) => {
		// Disable dates before today
		return current && current.valueOf() < Date.now() - 24 * 60 * 60 * 1000;
	};

	return (
		<>
			<style>{`
@media (max-width: 600px) {
  .create-listing-responsive {
    padding-left: 16px !important;
    padding-right: 16px !important;
    padding-top: 24px !important;
    padding-bottom: 24px !important;
    margin-bottom: 48px !important;
  }
  .create-listing-main-responsive {
    flex-direction: column !important;
    gap: 80px !important;
    align-items: center !important;
    margin-bottom: 0 !important;
    padding-bottom: 24px !important;
  }
  .create-listing-images-responsive,
  .create-listing-form-responsive {
    width: 100% !important;
    max-width: 450px !important;
    margin-left: auto !important;
    margin-right: auto !important;
  }
  .create-listing-images-responsive {
    width: 100% !important;
    max-width: 450px !important;
    aspect-ratio: 1/1 !important;
    height: auto !important;
    min-height: 300px !important;
    padding-bottom: 12px !important;
    margin-bottom: 16px !important;
    margin-top: 24px !important;
    padding-bottom: 32px !important;
  }
  .create-listing-form-responsive {
    width: 100% !important;
    max-width: 450px !important;
    margin-left: auto !important;
    margin-right: auto !important;
    margin-top: 16px !important;
    position: relative !important;
    z-index: 1 !important;
    padding-top: 40px !important;
    margin-bottom: 32px !important;
  }
  .listing-gallery-responsive .slick-arrow {
    color: var(--color-secondary, #3F8176) !important;
  }
  .listing-gallery-responsive .slick-dots li button {
    background: var(--color-secondary, #3F8176) !important;
  }
  .listing-gallery-responsive .slick-dots li.slick-active button {
    background: var(--color-secondary, #3F8176) !important;
    opacity: 1 !important;
    border: 2px solid var(--color-secondary, #3F8176) !important;
  }
  .listing-gallery-responsive .slick-dots li.slick-active::after {
    background: transparent !important;
  }
  .carousel-plus-overlay {
    position: absolute !important;
    bottom: 12px !important;
    right: 12px !important;
    width: 44px !important;
    height: 44px !important;
    border-radius: 50% !important;
    background-color: var(--color-secondary) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
    transition: all 0.3s ease !important;
    z-index: 10 !important;
  }
  .carousel-plus-overlay:hover {
    background-color: var(--color-secondary-hover, #3a7c6b) !important;
    transform: scale(1.1) !important;
  }
}

/* Add vertical spacing between buttons when they wrap */
.create-listing-buttons .ant-col {
  margin-bottom: 8px !important;
}
.create-listing-buttons .ant-col:last-child {
  margin-bottom: 0 !important;
}

.listing-gallery-responsive .slick-slide img,
.listing-gallery-responsive .slick-slide label,
.listing-gallery-responsive label {
  max-width: none !important;
  max-height: none !important;
  width: 100% !important;
  height: 100% !important;
}
.listing-gallery-responsive .slick-slide {
  overflow: visible !important;
}

.remove-image-button {
  position: absolute;
  top: 8px;
  right: 8px;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  z-index: 9999;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  transition: background 0.3s ease, transform 0.3s ease;
}

.remove-image-button:hover {
  background-color: #f0f0f0 !important;
  border-color: #1890ff !important;
  transform: scale(1.1) !important;
}

.remove-thumbnail-button:hover {
  background-color: #f0f0f0 !important;
  border-color: #ff4d4f !important;
  transform: scale(1.1) !important;
}
`}</style>
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
							gutter={36}
							align="top"
							style={{ marginTop: 0, paddingTop: 0 }}
							className="create-listing-main-responsive"
						>
							<Col
								xs={24}
								md={12}
								style={{
									display: 'flex',
									alignItems: 'flex-start',
									justifyContent: 'center',
									marginTop: 0,
									paddingTop: 0,
								}}
							>
								<div
									style={{
										width: '100%',
										maxWidth: 450,
										aspectRatio: '1/1',
										margin: '0 auto',
										padding: 0,
										boxSizing: 'border-box',
										position: 'relative',
									}}
									className="create-listing-images-responsive"
								>
									{/* Spacer to align with Item Details h1 */}
									<div style={{ height: '24px', marginBottom: '16px' }}></div>

									{/* Main Image */}
									{uploadedImages.length > 0 && (
										<div
											style={{
												width: '100%',
												maxWidth: 450,
												aspectRatio: '1/1',
												margin: '0 auto',
												padding: 0,
												boxSizing: 'border-box',
												position: 'relative',
												marginBottom: '16px',
											}}
										>
											<img
												src={uploadedImages[0]}
												alt="Main uploaded item"
												style={{
													width: '100%',
													height: '100%',
													aspectRatio: '1/1',
													maxWidth: 450,
													maxHeight: 450,
													borderRadius: '2px',
													border: '0.5px solid var(--color-foreground-2)',
													objectFit: 'cover',
													display: 'block',
													boxSizing: 'border-box',
													margin: '0 auto',
												}}
											/>
											<Button
												type="text"
												danger
												icon={<CloseOutlined />}
												aria-label="Remove main image"
												onClick={() => onImageRemove(uploadedImages[0])}
												className="remove-image-button"
												style={{
													position: 'absolute',
													top: '8px',
													right: '8px',
													background: 'white',
													border: '1px solid #d9d9d9',
													borderRadius: '4px',
													zIndex: 10,
													boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
													width: '32px',
													height: '32px',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													opacity: 1,
												}}
											/>
										</div>
									)}

									{/* Image Thumbnails */}
									{uploadedImages.length > 0 ? (
										<div
											style={{
												display: 'flex',
												flexWrap: 'wrap',
												gap: '8px',
												justifyContent: 'flex-start',
												marginTop: uploadedImages.length > 1 ? '16px' : '0',
												maxWidth: '450px',
												margin: '0 auto',
											}}
										>
											{/* Show additional images as thumbnails (skip the first one since it's the main image) */}
											{uploadedImages.slice(1).map((image, index) => (
												<Button
													key={image}
													type="text"
													style={{
														width: '80px',
														height: '80px',
														borderRadius: '4px',
														border: '1px solid var(--color-foreground-2)',
														overflow: 'hidden',
														position: 'relative',
														padding: 0,
														margin: 0,
														flexShrink: 0,
													}}
													onClick={() => {
														// Move clicked thumbnail to main position
														const newImages = [...uploadedImages];
														const clickedImage = newImages.splice(
															index + 1,
															1,
														)[0];
														newImages.unshift(clickedImage);
														// Note: This would require updating the parent state, but for now, just show the layout
													}}
												>
													<img
														src={image}
														alt={`Thumbnail ${index + 2}`}
														style={{
															width: '100%',
															height: '100%',
															objectFit: 'cover',
														}}
													/>
													<Button
														type="text"
														danger
														icon={<CloseOutlined />}
														aria-label="Remove image"
														onClick={(e) => {
															e.stopPropagation();
															onImageRemove(image);
														}}
														className="remove-thumbnail-button"
														style={{
															position: 'absolute',
															top: '2px',
															right: '2px',
															background: 'white',
															border: '1px solid #d9d9d9',
															borderRadius: '2px',
															zIndex: 10,
															boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
															width: '20px',
															height: '20px',
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'center',
															opacity: 1,
															fontSize: '10px',
														}}
													/>
												</Button>
											))}

											{/* Upload Thumbnail */}
											{uploadedImages.length < 5 && (
												<button
													type="button"
													style={{
														width: '80px',
														height: '80px',
														border: '2px dashed var(--color-foreground-2)',
														borderRadius: '4px',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														cursor: 'pointer',
														backgroundColor: 'var(--color-background-2)',
														padding: 0,
														flexShrink: 0,
													}}
													onClick={() =>
														additionalFileInputRef.current?.click()
													}
													onKeyDown={(e) => {
														if (e.key === 'Enter' || e.key === ' ') {
															e.preventDefault();
															additionalFileInputRef.current?.click();
														}
													}}
													onMouseEnter={(e) => {
														e.currentTarget.style.borderColor =
															'var(--color-secondary)';
														e.currentTarget.style.backgroundColor =
															'rgba(63, 129, 118, 0.05)';
													}}
													onMouseLeave={(e) => {
														e.currentTarget.style.borderColor =
															'var(--color-foreground-2)';
														e.currentTarget.style.backgroundColor =
															'var(--color-background-2)';
													}}
													aria-label="Upload additional image"
												>
													<PlusOutlined
														style={{
															fontSize: '24px',
															color: 'var(--color-foreground-2)',
														}}
													/>
												</button>
											)}
										</div>
									) : (
										/* Upload area when no images */
										<div
											style={{
												width: '100%',
												maxWidth: 450,
												aspectRatio: '1/1',
												margin: '0 auto',
												padding: 0,
												boxSizing: 'border-box',
												position: 'relative',
												marginTop: '16px',
											}}
										>
											<button
												type="button"
												style={{
													width: '100%',
													height: '100%',
													border: '2px dashed var(--color-foreground-2)',
													borderRadius: '4px',
													display: 'flex',
													flexDirection: 'column',
													alignItems: 'center',
													justifyContent: 'center',
													cursor: 'pointer',
													backgroundColor: 'var(--color-background-2)',
													padding: 0,
												}}
												onClick={() => mainFileInputRef.current?.click()}
												onKeyDown={(e) => {
													if (e.key === 'Enter' || e.key === ' ') {
														e.preventDefault();
														mainFileInputRef.current?.click();
													}
												}}
												onMouseEnter={(e) => {
													e.currentTarget.style.borderColor =
														'var(--color-secondary)';
													e.currentTarget.style.backgroundColor =
														'rgba(63, 129, 118, 0.05)';
												}}
												onMouseLeave={(e) => {
													e.currentTarget.style.borderColor =
														'var(--color-foreground-2)';
													e.currentTarget.style.backgroundColor =
														'var(--color-background-2)';
												}}
												aria-label="Upload image"
											>
												<PlusOutlined
													style={{
														fontSize: '48px',
														color: 'var(--color-foreground-2)',
													}}
												/>
												<div
													style={{
														marginTop: '16px',
														color: 'var(--color-foreground-2)',
														fontSize: '16px',
														fontWeight: '500',
													}}
												>
													Click to upload images
												</div>
											</button>
										</div>
									)}
								</div>
							</Col>

							{/* Right Column - Form */}
							<Col
								xs={24}
								md={12}
								style={{ marginTop: 0, paddingTop: 0 }}
								className="create-listing-form-responsive"
							>
								<div style={{ marginTop: '60px', paddingTop: '20px' }}>
									<Space
										direction="vertical"
										size="large"
										style={{ width: '100%' }}
									>
										<Form.Item
											label="Title"
											name="title"
											rules={[
												{ required: true, message: 'Title is required' },
												{
													max: 200,
													message: 'Title cannot exceed 200 characters',
												},
											]}
										>
											<Input placeholder="Enter item title" />
										</Form.Item>

										<Form.Item
											label="Location"
											name="location"
											rules={[
												{ required: true, message: 'Location is required' },
												{
													max: 255,
													message: 'Location cannot exceed 255 characters',
												},
											]}
										>
											<Input placeholder="Enter location" />
										</Form.Item>

										<Form.Item
											label="Category"
											name="category"
											rules={[
												{ required: true, message: 'Category is required' },
											]}
										>
											<Select placeholder="Select a category">
												{categories.map((category) => (
													<Select.Option key={category} value={category}>
														{category}
													</Select.Option>
												))}
											</Select>
										</Form.Item>

										<Form.Item
											label="Reservation Period"
											name="sharingPeriod"
											rules={[
												{
													required: true,
													message: 'Reservation period is required',
												},
											]}
										>
											<RangePicker
												style={{ width: '100%' }}
												placeholder={['Start date', 'End date']}
												disabledDate={disabledDate}
											/>
										</Form.Item>

										<Form.Item
											label="Description"
											name="description"
											rules={[
												{ required: true, message: 'Description is required' },
												{
													max: maxCharacters,
													message: `Description cannot exceed ${maxCharacters} characters`,
												},
											]}
										>
											<TextArea
												placeholder="Describe your item"
												rows={6}
												showCount={{
													formatter: ({ count }: { count: number }) =>
														`${count}/${maxCharacters}`,
												}}
											/>
										</Form.Item>
									</Space>
								</div>

								{/* Action Buttons */}
								<Row
									gutter={16}
									style={{ marginTop: '24px' }}
									className="create-listing-buttons"
								>
									<Col>
										<Button
											className="secondaryButton"
											onClick={onCancel}
											disabled={isLoading}
										>
											Cancel
										</Button>
									</Col>
									<Col>
										<Button
											className="secondaryButton"
											type="default"
											onClick={() => handleFormSubmit(true)}
											loading={isLoading}
										>
											Save as Draft
										</Button>
									</Col>
									<Col>
										<Button
											className="primaryButton"
											type="primary"
											onClick={() => handleFormSubmit(false)}
											loading={isLoading}
										>
											Publish
										</Button>
									</Col>
								</Row>
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
				onClose={() => {
					setLocalModal('none');
				}}
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
				onClose={() => {
					setLocalModal('none');
				}}
			/>
		</>
	);
}

// Render modals outside of main JSX so imports are used (component exports are within same file scope)
export default CreateListing;
