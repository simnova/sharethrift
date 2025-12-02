import { useState, type FC } from 'react';
import { Form, Button, Typography, Upload, Avatar, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type {
	UploadFile,
	UploadChangeParam,
} from 'antd/es/upload/interface.tsx';
import type {
	PersonalUser,
	PersonalUserUpdateInput,
} from '../../../../generated.tsx';
import { handleCountryChange } from '../../../shared/payment/country-change-utils.ts';
import type { ZipcodeRule } from '../../../shared/payment/billing-address-form-items.tsx';
import type { Country } from '../../../shared/payment/country-type.ts';
import { ProfileSetupForm } from './profile-setup-form.tsx';

const { Title } = Typography;

interface ProfileSetupProps {
	currentPersonalUserData?: PersonalUser;
	onSaveAndContinue: (values: PersonalUserUpdateInput) => void;
	loading: boolean;
	countries: Country[];
}

export const ProfileSetup: FC<ProfileSetupProps> = (props) => {
	const [form] = Form.useForm();
	const [avatarUrl, setAvatarUrl] = useState<string>('');
	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const [zipCodeRules, setZipCodeRules] = useState<ZipcodeRule[]>([
		{ required: true, message: 'Please enter the ZIP/Postal code.' },
	]);
	const selectedCountry = Form.useWatch(
		['account', 'profile', 'location', 'country'],
		form,
	);

	const handleSaveAndContinue = (values: PersonalUserUpdateInput) => {
		console.log('Form Values:', values);
		props.onSaveAndContinue(values);
	};

	const handleAvatarChange = (info: UploadChangeParam<UploadFile<unknown>>) => {
		const latestFileList = info.fileList.slice(-1);
		setFileList(latestFileList);

		const fileObj = latestFileList[0]?.originFileObj;
		if (
			fileObj &&
			(fileObj.type === 'image/jpeg' || fileObj.type === 'image/png')
		) {
			const reader = new FileReader();
			reader.onload = (e) => {
				setAvatarUrl(e.target?.result as string);
			};
			reader.readAsDataURL(fileObj);
		} else if (latestFileList.length === 0) {
			setAvatarUrl('');
		}
	};

	const onCountryChange = (value: string) => {
		handleCountryChange(value, form, setZipCodeRules, [
			'account',
			'profile',
			'location',
			'state',
		]);
	};

	const beforeUpload = (file: File) => {
		const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
		if (!isJpgOrPng) {
			message.error('You can only upload JPG/PNG files!');
			return Upload.LIST_IGNORE;
		}
		const isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
			message.error('Image must be smaller than 2MB!');
			return Upload.LIST_IGNORE;
		}
		return false; // Prevent actual upload
	};

	return (
		<div style={{ maxWidth: 500, margin: '0 auto' }}>
			<div style={{ textAlign: 'center', marginBottom: '2rem' }}>
				<Title
					level={1}
					className="title36"
					style={{
						textAlign: 'center',
						marginBottom: '32px',
						color: 'var(--color-message-text)',
					}}
				>
					Profile Setup
				</Title>
			</div>

			<div style={{ textAlign: 'center', marginBottom: '2rem' }}>
				<Avatar
					size={100}
					src={avatarUrl || undefined}
					alt="Profile Avatar"
					style={{
						backgroundColor: '#f0f0f0',
						border: '3px solid #e0e0e0',
						marginBottom: '1rem',
						objectFit: 'cover',
					}}
				/>
				<div>
					<Upload
						name="avatar"
						listType="text"
						fileList={fileList}
						onChange={handleAvatarChange}
						beforeUpload={beforeUpload}
						showUploadList={false}
						accept="image/jpeg,image/png"
						maxCount={1}
					>
						<Button
							type="default"
							icon={<UploadOutlined />}
							style={{
								backgroundColor: 'var(--color-secondary)',
								borderColor: 'var(--color-secondary)',
								color: 'white',
								borderRadius: '20px',
								paddingLeft: '20px',
								paddingRight: '20px',
							}}
						>
							{avatarUrl ? 'Change Image' : 'Choose Image'}
						</Button>
					</Upload>
				</div>
			</div>

			<ProfileSetupForm
				form={form}
				currentPersonalUserData={props.currentPersonalUserData}
				onSaveAndContinue={handleSaveAndContinue}
				countries={props.countries}
				selectedCountry={selectedCountry}
				onCountryChange={onCountryChange}
				zipCodeRules={zipCodeRules}
				loading={props.loading}
			/>
		</div>
	);
};
