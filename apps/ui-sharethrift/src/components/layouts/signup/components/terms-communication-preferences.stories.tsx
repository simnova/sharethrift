import type { Meta, StoryObj } from '@storybook/react';
import { TermsCommunicationPreferences } from './terms-communication-preferences.tsx';
import { Form } from 'antd';

const meta: Meta<typeof TermsCommunicationPreferences> = {
	title: 'Signup/TermsCommunicationPreferences',
	component: TermsCommunicationPreferences,
	parameters: {
		layout: 'centered',
	},
	decorators: [
		(Story) => (
			<Form style={{ width: 600 }}>
				<Story />
			</Form>
		),
	],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
