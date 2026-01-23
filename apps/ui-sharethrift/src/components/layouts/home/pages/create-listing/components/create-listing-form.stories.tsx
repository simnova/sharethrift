import type { Meta, StoryObj } from '@storybook/react';
import { Form } from 'antd';
import { ListingForm } from './create-listing-form';

const meta: Meta<typeof ListingForm> = {
	title: 'CreateListing/ListingForm',
	component: ListingForm,
	parameters: {
		layout: 'padded',
	},
	decorators: [
		(Story) => (
			<Form>
				<Story />
			</Form>
		),
	],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		categories: ['Electronics', 'Books', 'Clothing', 'Tools'],
		isLoading: false,
		maxCharacters: 500,
		handleFormSubmit: (isDraft: boolean) => console.log('Form submitted', { isDraft }),
		onCancel: () => console.log('Cancelled'),
	},
};

export const Loading: Story = {
	args: {
		...Default.args,
		isLoading: true,
	},
};

export const WithFewCategories: Story = {
	args: {
		...Default.args,
		categories: ['Electronics', 'Books'],
	},
};