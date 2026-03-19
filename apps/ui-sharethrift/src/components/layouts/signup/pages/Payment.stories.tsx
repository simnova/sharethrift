import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { Payment } from './Payment.tsx';
import type React from 'react';

const meta: Meta<typeof Payment> = {
	title: 'Pages/Signup/Payment',
	component: Payment,
	parameters: {
		layout: 'fullscreen',
	},
	decorators: [
		(Story) => (
			<BrowserRouter>
				<Story />
			</BrowserRouter>
		),
	],
};

export default meta;
type Story = StoryObj<typeof Payment>;

export const Default: Story = {};

export const WithPrefilledData: Story = {
	decorators: [
		(Story: React.FC) => (
			<BrowserRouter>
				<div>
					<Story />
					<script>
						{`
              // This would normally be done via form initialization
              setTimeout(() => {
                const form = document.querySelector('form');
                if (form) {
                  const inputs = form.querySelectorAll('input');
                  if (inputs[0]) inputs[0].value = '4532 1234 5678 9012';
                  if (inputs[1]) inputs[1].value = '12/25';
                  if (inputs[2]) inputs[2].value = '123';
                  if (inputs[3]) inputs[3].value = 'John';
                  if (inputs[4]) inputs[4].value = 'Doe';
                  if (inputs[5]) inputs[5].value = 'johndoe@gmail.com';
                  if (inputs[6]) inputs[6].value = '(302) 766-3711';
                  if (inputs[7]) inputs[7].value = '123 Main St';
                  if (inputs[8]) inputs[8].value = 'Apt 4B';
                  if (inputs[9]) inputs[9].value = 'Wilmington';
                  if (inputs[10]) inputs[10].value = 'DE';
                  if (inputs[11]) inputs[11].value = 'USA';
                }
              }, 100);
            `}
					</script>
				</div>
			</BrowserRouter>
		),
	],
};
