import type { Meta, StoryObj } from '@storybook/react';
import { useState, type ReactNode } from 'react';
import { ApplicantIdContext, useApplicantId } from './applicant-id-context.tsx';

// Provider component for stories
const ApplicantIdProvider = ({ children }: { children: ReactNode }) => {
	const [applicantId, setApplicantId] = useState<string | null>(null);
	return (
		<ApplicantIdContext.Provider value={{ applicantId, setApplicantId }}>
			{children}
		</ApplicantIdContext.Provider>
	);
};

// Test component that uses the hook
const ApplicantIdConsumer = () => {
	const { applicantId, setApplicantId } = useApplicantId();
	return (
		<div>
			<p>Current Applicant ID: {applicantId ?? 'None'}</p>
			<button type="button" onClick={() => setApplicantId('test-applicant-123')}>
				Set Applicant ID
			</button>
			<button type="button" onClick={() => setApplicantId(null)}>
				Clear Applicant ID
			</button>
		</div>
	);
};

const meta: Meta<typeof ApplicantIdConsumer> = {
	title: 'Contexts/ApplicantIdContext',
	component: ApplicantIdConsumer,
	parameters: {
		layout: 'centered',
	},
	decorators: [
		(Story) => (
			<ApplicantIdProvider>
				<Story />
			</ApplicantIdProvider>
		),
	],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// Test error case when used outside provider
const WithoutProvider = () => {
	try {
		useApplicantId();
		return <div>Should have thrown an error</div>;
	} catch {
		return <div>Error: useApplicantId must be used within an ApplicantIdProvider</div>;
	}
};

export const ErrorWithoutProvider: Story = {
	render: () => <WithoutProvider />,
	decorators: [], // Remove the provider decorator
};
