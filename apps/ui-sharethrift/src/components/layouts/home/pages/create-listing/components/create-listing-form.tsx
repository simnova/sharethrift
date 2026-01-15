import { Form, Input, Select, DatePicker, Button } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import TextArea from 'antd/es/input/TextArea';

const { Option } = Select;

interface ListingFormProps {
	categories: string[];
	isLoading: boolean;
	maxCharacters: number;
	handleFormSubmit: (isDraft: boolean) => void;
	onCancel: () => void;
}

export const ListingForm: React.FC<ListingFormProps> = ({
	categories,
	isLoading,
	maxCharacters,
	handleFormSubmit,
	onCancel,
}) => {
	const disabledDate: RangePickerProps['disabledDate'] = (current) => {
		// Can not select days before today
		return current && current.isBefore(new Date().setHours(0, 0, 0, 0));
	};

	return (
		<div style={{ paddingLeft: 32, paddingRight: 32 }}>
			<Form.Item
				label="Title"
				name="title"
				rules={[{ required: true, message: 'Please enter a title' }]}
			>
				<Input placeholder="Enter listing title" />
			</Form.Item>

			<Form.Item
				label="Description"
				name="description"
				rules={[{ required: true, message: 'Please enter a description' }]}
			>
				<TextArea
					placeholder="Describe your item and sharing terms"
					rows={6}
					maxLength={maxCharacters}
				/>
			</Form.Item>

			<Form.Item
				label="Category"
				name="category"
				rules={[{ required: true, message: 'Please select a category' }]}
			>
				<Select placeholder="Select a category">
					{categories.map((category) => (
						<Option key={category} value={category}>
							{category}
						</Option>
					))}
				</Select>
			</Form.Item>

			<Form.Item
				label="Location"
				name="location"
				rules={[{ required: true, message: 'Please enter a location' }]}
			>
				<Input placeholder="Enter location" />
			</Form.Item>

			<Form.Item
				label="Sharing Period"
				name="sharingPeriod"
				rules={[{ required: true, message: 'Please select sharing dates' }]}
			>
				<DatePicker.RangePicker
					disabledDate={disabledDate}
					placeholder={['Start date', 'End date']}
					style={{ width: '100%' }}
				/>
			</Form.Item>

			<div style={{ display: 'flex', gap: 16, marginTop: 32 }}>
				<Button
					type="default"
					onClick={onCancel}
					disabled={isLoading}
					style={{ flex: 1 }}
				>
					Cancel
				</Button>
				<Button
					type="default"
					onClick={() => handleFormSubmit(true)}
					disabled={isLoading}
					style={{ flex: 1 }}
				>
					Save as Draft
				</Button>
				<Button
					type="primary"
					onClick={() => handleFormSubmit(false)}
					loading={isLoading}
					style={{ flex: 1 }}
				>
					Publish Listing
				</Button>
			</div>
		</div>
	);
};