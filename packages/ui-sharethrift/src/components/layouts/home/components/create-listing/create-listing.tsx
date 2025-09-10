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
import { Carousel } from 'antd';
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
				onSubmit(formData, isDraft);
			})
			.catch((errorInfo) => {
				console.log('Validation failed:', errorInfo);
				if (!isDraft) {
					message.error('Please fill in all required fields to publish');
				}
			});
	};

	const disabledDate: DatePickerProps['disabledDate'] = (current) => {
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
          }
          .create-listing-main-responsive {
            flex-direction: column !important;
            gap: 48px !important;
            align-items: center !important;
            margin-bottom: 0 !important;
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
            maxWidth: 450px !important;
            aspectRatio: '9/10' !important;
            height: auto !important;
            min-height: 300px !important;
            padding-bottom: 12px !important;
            margin-bottom: 16px !important;
          }
          .create-listing-form-responsive {
            width: 100% !important;
            max-width: 450px !important;
            margin-left: auto !important;
            margin-right: auto !important;
            margin-top: 16px !important;
            position: relative !important;
            z-index: 1 !important;
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
				<Col span={24} style={{ marginTop: 0, paddingTop: 0 }}>
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
										aspectRatio: '9/10',
										margin: '0 auto',
										padding: 0,
										boxSizing: 'border-box',
										position: 'relative',
									}}
									className="create-listing-images-responsive"
								>
									{/* Spacer to align with Item Details h1 */}
									<div style={{ height: '24px', marginBottom: '16px' }}></div>

									{/* Single Image Gallery Carousel */}
									<div
										style={{
											width: '100%',
											maxWidth: 450,
											aspectRatio: '9/10',
											margin: '0 auto',
											padding: 0,
											boxSizing: 'border-box',
											position: 'relative',
										}}
									>
										<Carousel
											arrows
											dots
											swipeToSlide
											style={{ width: '100%', height: '100%' }}
											className="listing-gallery-responsive"
										>
											{/* All uploaded images */}
											{uploadedImages.map((image, index) => (
												<div
													key={image}
													style={{
														width: '100%',
														height: '100%',
														aspectRatio: '9/10',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														position: 'relative',
														overflow: 'visible',
													}}
												>
													<img
														src={image}
														alt={`Uploaded item ${index + 1}`}
														style={{
															width: '100%',
															height: '100%',
															aspectRatio: '9/10',
															maxWidth: 450,
															maxHeight: 500,
															borderRadius: '2px',
															border: '0.5px solid var(--color-foreground-2)',
															objectFit: 'cover',
															display: 'block',
															boxSizing: 'border-box',
															margin: '0 auto',
														}}
													/>
													{/* Image Counter */}
													<div
														style={{
															position: 'absolute',
															top: '8px',
															left: '8px',
															background: 'rgba(0, 0, 0, 0.7)',
															color: 'white',
															padding: '4px 8px',
															borderRadius: '4px',
															fontSize: '12px',
															fontWeight: '500',
															zIndex: 5,
														}}
													>
														{index + 1} / {uploadedImages.length}
													</div>
													<Button
														type="text"
														danger
														icon={<CloseOutlined />}
														onClick={() => onImageRemove(image)}
														style={{
															position: 'absolute',
															top: '8px',
															right: '8px',
															background: 'white',
															border: '1px solid #d9d9d9',
															borderRadius: '4px',
															zIndex: 9999,
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
											))}

											{/* Upload Button as carousel slide */}
											{uploadedImages.length < 5 && (
												<div
													style={{
														width: '100%',
														height: '100%',
														aspectRatio: '9/10',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
													}}
												>
													<input
														type="file"
														accept="image/*"
														onChange={(e) => {
															const file = e.target.files?.[0];
															if (file) {
																const reader = new FileReader();
																reader.onload = () => {
																	const result = reader.result as string;
																	onImageAdd(result);
																};
																reader.readAsDataURL(file);
															}
															// Reset input
															e.target.value = '';
														}}
														style={{ display: 'none' }}
														id="carousel-image-upload"
													/>
													<label
														htmlFor="carousel-image-upload"
														style={{
															width: '100%',
															height: '100%',
															aspectRatio: '9/10',
															maxWidth: 450,
															maxHeight: 500,
															border: '2px dashed var(--color-foreground-2)',
															borderRadius: '2px',
															display: 'flex',
															flexDirection: 'column',
															alignItems: 'center',
															justifyContent: 'center',
															cursor: 'pointer',
															transition: 'border-color 0.3s ease',
															backgroundColor: 'var(--color-background-2)',
															boxSizing: 'border-box',
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
													>
														<PlusOutlined
															style={{
																fontSize: '48px',
																color: 'var(--color-foreground-2)',
																marginBottom: '16px',
															}}
														/>
														<div
															style={{
																fontSize: '18px',
																fontWeight: '500',
																color: 'var(--color-message-text)',
																marginBottom: '8px',
															}}
														>
															Click to upload images
														</div>
														<div
															style={{
																fontSize: '14px',
																color: 'var(--color-primary-disabled)',
															}}
														>
															or drag and drop
														</div>
													</label>
												</div>
											)}
										</Carousel>

										{/* Floating Plus Button Overlay */}
										{uploadedImages.length > 0 && uploadedImages.length < 5 && (
											<>
												<input
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
														// Reset input
														e.target.value = '';
													}}
													style={{ display: 'none' }}
													id="overlay-image-upload"
												/>
												<label
													htmlFor="overlay-image-upload"
													style={{
														position: 'absolute',
														bottom: '12px',
														right: '12px',
														width: '44px',
														height: '44px',
														borderRadius: '50%',
														backgroundColor: 'var(--color-secondary)',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														cursor: 'pointer',
														boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
														transition: 'all 0.3s ease',
														zIndex: 10,
													}}
													onMouseEnter={(e) => {
														e.currentTarget.style.backgroundColor =
															'var(--color-secondary-hover, #3a7c6b)';
														e.currentTarget.style.transform = 'scale(1.1)';
													}}
													onMouseLeave={(e) => {
														e.currentTarget.style.backgroundColor =
															'var(--color-secondary)';
														e.currentTarget.style.transform = 'scale(1)';
													}}
												>
													<PlusOutlined
														style={{
															fontSize: '20px',
															color: 'white',
														}}
													/>
												</label>
											</>
										)}
									</div>

									{/* Image Count Display */}
									<div
										style={{
											marginTop: '8px',
											fontSize: '12px',
											color: 'var(--color-primary-disabled)',
											textAlign: 'right',
										}}
									>
										{uploadedImages.length}/5 images
									</div>
								</div>
							</Col>

							{/* Right Column - Form */}
							<Col
								xs={24}
								md={12}
								style={{ marginTop: 0, paddingTop: 0 }}
								className="create-listing-form-responsive"
							>
								<div>
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
													formatter: ({ count }) => `${count}/${maxCharacters}`,
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
		</>
	);
}
