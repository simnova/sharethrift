import { Row, Col, Button } from 'antd';
import {
	DeleteOutlined,
	PauseCircleOutlined,
	StopOutlined,
} from '@ant-design/icons';
import { ListingFormFields } from '../shared/listing-form-fields.tsx';

interface EditListingFormProps {
	categories: string[];
	isLoading: boolean;
	maxCharacters: number;
	handleFormSubmit: () => void;
	onNavigateBack: () => void;
	onPause: () => void;
	onDelete: () => void;
	onCancel: () => void;
	canPause: boolean;
	canCancel: boolean;
}

export const EditListingForm: React.FC<EditListingFormProps> = ({
	categories,
	isLoading,
	maxCharacters,
	handleFormSubmit,
	onNavigateBack,
	onPause,
	onDelete,
	onCancel,
	canPause,
	canCancel,
}) => {
	return (
		<ListingFormFields
			categories={categories}
			maxCharacters={maxCharacters}
			rangePickerProps={{
				format: 'YYYY-MM-DD',
				picker: 'date',
				needConfirm: false,
				changeOnBlur: true,
			}}
			actions={
				<Row
					gutter={16}
					style={{ marginTop: '24px' }}
					className="create-listing-buttons"
				>
					<Col>
						<Button
							className="secondaryButton"
							onClick={onNavigateBack}
							disabled={isLoading}
						>
							Cancel
						</Button>
					</Col>
					<Col>
						<Button
							className="secondaryButton"
							icon={<DeleteOutlined />}
							onClick={onDelete}
							disabled={isLoading}
						>
							Delete
						</Button>
					</Col>
					{canCancel && (
						<Col>
							<Button
								className="secondaryButton"
								icon={<StopOutlined />}
								onClick={onCancel}
								disabled={isLoading}
							>
								Cancel Listing
							</Button>
						</Col>
					)}
					{canPause && (
						<Col>
							<Button
								className="secondaryButton"
								icon={<PauseCircleOutlined />}
								onClick={onPause}
								disabled={isLoading}
							>
								Pause
							</Button>
						</Col>
					)}
					<Col>
						<Button
							className="primaryButton"
							type="primary"
							onClick={handleFormSubmit}
							loading={isLoading}
						>
							Save Changes
						</Button>
					</Col>
				</Row>
			}
		/>
	);
};
