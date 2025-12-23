import { Form, Input, Select, DatePicker, Space } from 'antd';
import type { ConfigType } from 'dayjs';
import type { ReactNode } from 'react';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface ListingFormFieldsProps {
	categories: string[];
	maxCharacters: number;
	disabledDate?: (current: ConfigType) => boolean;
	actions: ReactNode;
	rangePickerProps?: Record<string, unknown>;
}

export const ListingFormFields: React.FC<ListingFormFieldsProps> = ({
	categories,
	maxCharacters,
	disabledDate,
	actions,
	rangePickerProps = {},
}) => {
	return (
		<div className="create-listing-form-responsive">
			<Space direction="vertical" size="large" style={{ width: '100%' }}>
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
						{...rangePickerProps}
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

				{actions}
			</Space>
		</div>
	);
};
