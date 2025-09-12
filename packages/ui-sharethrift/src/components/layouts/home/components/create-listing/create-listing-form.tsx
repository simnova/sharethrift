import { Row, Col, Button, Form, Input, Select, DatePicker, Space } from 'antd';
import type { FormInstance } from 'antd';
import type { ConfigType } from 'dayjs';
import dayjs from 'dayjs';

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

export interface ListingFormProps {
	categories: string[];
	isLoading: boolean;
	form: FormInstance<CreateListingFormData>;
	maxCharacters: number;
	handleFormSubmit: (isDraft: boolean) => void;
	onCancel: () => void;
}

export const ListingForm: React.FC<ListingFormProps> = ({
	categories,
	isLoading,
	form,
	maxCharacters,
	handleFormSubmit,
	onCancel,
}) => {
	const disabledDate = (current: ConfigType) => {
		try {
			const maybeDay = current as dayjs.Dayjs;
			if (!maybeDay || typeof maybeDay.isBefore !== 'function') {
				return false;
			}

			return maybeDay.isBefore(dayjs(), 'day');
		} catch (_err) {
			return false;
		}
	};

	return (
		<div className="create-listing-form-responsive">
			<Space direction="vertical" size="large" style={{ width: '100%' }}>
				<Form form={form} layout="vertical" requiredMark="optional">
					<Form.Item
						label="Title"
						name="title"
						rules={[
							{ required: true, message: 'Title is required' },
							{ max: 200, message: 'Title cannot exceed 200 characters' },
						]}
					>
						<Input placeholder="Enter item title" />
					</Form.Item>

					<Form.Item
						label="Location"
						name="location"
						rules={[
							{ required: true, message: 'Location is required' },
							{ max: 255, message: 'Location cannot exceed 255 characters' },
						]}
					>
						<Input placeholder="Enter location" />
					</Form.Item>

					<Form.Item
						label="Category"
						name="category"
						rules={[{ required: true, message: 'Category is required' }]}
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
							{ required: true, message: 'Reservation period is required' },
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
				</Form>
			</Space>
		</div>
	);
};

export default ListingForm;
