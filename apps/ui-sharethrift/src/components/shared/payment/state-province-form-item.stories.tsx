import type { Meta, StoryObj } from '@storybook/react';
import { StateProvinceFormItem } from './state-province-form-item.tsx';
import { Form } from 'antd';
import { countriesMockData } from '../../layouts/signup/components/countries-mock-data.ts';

const usStates = countriesMockData.find(c => c.countryCode === 'US')?.states || [];
const caStates = countriesMockData.find(c => c.countryCode === 'CA')?.states || [];

const meta: Meta<typeof StateProvinceFormItem> = {
	title: 'Components/Shared/Payment/StateProvinceFormItem',
	component: StateProvinceFormItem,
	parameters: {
		layout: 'padded',
	},
	decorators: [
		(Story) => (
			<Form
				style={{ width: '100%', maxWidth: 400, padding: 20 }}
				initialValues={{
					state: '',
				}}
			>
				<Story />
			</Form>
		),
	],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const WithUSStates: Story = {
	args: {
		fieldPath: 'state',
		states: usStates,
		isBillingFormItem: false,
	},
};

export const WithUSStateSelected: Story = {
	args: {
		fieldPath: 'state',
		states: usStates,
		isBillingFormItem: false,
	},
	decorators: [
		(Story) => (
			<Form
				style={{ width: '100%', maxWidth: 400, padding: 20 }}
				initialValues={{
					state: 'CA',
				}}
			>
				<Story />
			</Form>
		),
	],
};

export const WithCanadianProvinces: Story = {
	args: {
		fieldPath: 'state',
		states: caStates,
		isBillingFormItem: false,
	},
};

export const WithCanadianProvinceSelected: Story = {
	args: {
		fieldPath: 'state',
		states: caStates,
		isBillingFormItem: false,
	},
	decorators: [
		(Story) => (
			<Form
				style={{ width: '100%', maxWidth: 400, padding: 20 }}
				initialValues={{
					state: 'ON',
				}}
			>
				<Story />
			</Form>
		),
	],
};

export const NoStatesAvailable: Story = {
	args: {
		fieldPath: 'state',
		states: [],
		isBillingFormItem: false,
	},
};

export const BillingFormVariant: Story = {
	args: {
		fieldPath: 'billingState',
		states: usStates,
		isBillingFormItem: true,
	},
};

export const BillingFormWithoutStates: Story = {
	args: {
		fieldPath: 'billingState',
		states: [],
		isBillingFormItem: true,
	},
};
