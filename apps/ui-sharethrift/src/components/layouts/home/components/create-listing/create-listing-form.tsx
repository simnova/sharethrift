import { Row, Col, Button } from 'antd';
import type { ConfigType } from 'dayjs';
import dayjs from 'dayjs';
import { ListingFormFields } from '../shared/listing-form-fields.tsx';

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
	const disabledDate = (current: ConfigType) => {
		try {
			const maybeDay = current as dayjs.Dayjs;
			if (!maybeDay || typeof maybeDay.isBefore !== 'function') {
				return false;
			}

			return maybeDay.isBefore(dayjs(), 'day');
		} catch {
			return false;
		}
	};

	return (
		<ListingFormFields
			categories={categories}
			maxCharacters={maxCharacters}
			disabledDate={disabledDate}
			actions={
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
			}
		/>
	);
};

