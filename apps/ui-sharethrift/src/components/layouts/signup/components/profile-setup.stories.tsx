import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { ProfileSetup } from './profile-setup.tsx';
import type { PersonalUser } from '../../../../generated.tsx';
import { countriesMockData } from './countries-mock-data.ts';

const mockPersonalUser: PersonalUser = {
	__typename: 'PersonalUser',
	id: 'user-1',
	userType: 'PersonalUser',
	isBlocked: false,
	account: {
		__typename: 'PersonalUserAccount',
		username: 'johndoe',
		profile: {
			__typename: 'PersonalUserAccountProfile',
			firstName: 'John',
			lastName: 'Doe',
			location: {
				__typename: 'PersonalUserAccountProfileLocation',
				city: 'Toronto',
				state: 'ON',
				country: 'CA',
			},
		},
	},
};

const meta: Meta<typeof ProfileSetup> = {
	title: 'Components/ProfileSetup',
	component: ProfileSetup,
	tags: ['!dev'],
	args: {
		currentPersonalUserData: mockPersonalUser,
		onSaveAndContinue: fn(),
		loading: false,
		countries: countriesMockData,
	},
	parameters: {
		layout: 'padded',
	},
};

export default meta;
type Story = StoryObj<typeof ProfileSetup>;

const createFile = (name: string, type: string, sizeInBytes = 1280) => {
	const content = new Array(sizeInBytes).fill('a').join('');
	return new File([content], name, { type });
};

const mockFileReader = () => {
	const originalFileReader = globalThis.FileReader;
	class MockFileReader {
		public onload: ((event: ProgressEvent<FileReader>) => void) | null = null;
		readAsDataURL() {
			const event = {
				target: { result: 'data:image/png;base64,avatar' },
			} as ProgressEvent<FileReader>;
			this.onload?.(event);
		}
	}
	globalThis.FileReader = MockFileReader as unknown as typeof FileReader;
	return () => {
		globalThis.FileReader = originalFileReader;
	};
};

// Test default rendering with all props
export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.queryByText(/Profile Setup/i)).toBeInTheDocument();
			},
			{ timeout: 2000 },
		);
	},
};

// Test that upload button renders
export const WithUserData: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitFor(
			() => {
				const uploadButton = canvas.queryByText(/Choose Image/i);
				expect(uploadButton).toBeInTheDocument();
			},
			{ timeout: 2000 },
		);
	},
};

// Test loading state
export const LoadingState: Story = {
	args: {
		loading: true,
	},
	play: async ({ canvasElement }) => {
		await waitFor(
			() => {
				expect(canvasElement).toBeTruthy();
			},
			{ timeout: 2000 },
		);
	},
};

// Test with no user data
export const NoUserData: Story = {
	args: {
		currentPersonalUserData: undefined,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const uploadButton = canvas.queryByText(/Choose Image/i);
		expect(uploadButton).toBeInTheDocument();
	},
};

// Test with empty countries list
export const EmptyCountriesList: Story = {
	args: {
		countries: [],
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.queryByText(/Profile Setup/i)).toBeInTheDocument();
			},
			{ timeout: 2000 },
		);
	},
};

export const ValidImageUpload: Story = {
	play: async ({ canvasElement }) => {
		const cleanupFileReader = mockFileReader();
		const canvas = within(canvasElement);

		await waitFor(
			() => {
				const uploadButton = canvas.queryByText(/Choose Image/i);
				expect(uploadButton).toBeInTheDocument();
			},
			{ timeout: 2000 },
		);

		const input = canvasElement.querySelector('input[type="file"]');
		expect(input).toBeTruthy();

		const file = createFile('avatar.jpg', 'image/jpeg');
		await userEvent.upload(input as HTMLInputElement, file);

		await waitFor(
			() => {
				expect(canvas.queryByText(/Change Image/i)).toBeInTheDocument();
			},
			{ timeout: 2000 },
		);

		cleanupFileReader();
	},
};

// Test with invalid file type upload (PDF)
export const InvalidFileTypeUpload: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitFor(
			() => {
				const uploadButton = canvas.queryByText(/Choose Image/i);
				expect(uploadButton).toBeInTheDocument();
			},
			{ timeout: 2000 },
		);

		const input = canvasElement.querySelector('input[type="file"]');
		expect(input).toBeTruthy();

		const file = createFile('document.pdf', 'application/pdf');
		await userEvent.upload(input as HTMLInputElement, file);

		await waitFor(
			() => {
				expect(canvas.queryByText(/Choose Image/i)).toBeInTheDocument();
			},
			{ timeout: 2000 },
		);
	},
};

// Test with oversized image upload
export const OversizedImageUpload: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitFor(
			() => {
				const uploadButton = canvas.queryByText(/Choose Image/i);
				expect(uploadButton).toBeInTheDocument();
			},
			{ timeout: 2000 },
		);

		const input = canvasElement.querySelector('input[type="file"]');
		expect(input).toBeTruthy();

		const file = createFile('large-avatar.jpg', 'image/jpeg', 3 * 1024 * 1024);
		await userEvent.upload(input as HTMLInputElement, file);

		await waitFor(
			() => {
				expect(canvas.queryByText(/Choose Image/i)).toBeInTheDocument();
			},
			{ timeout: 2000 },
		);
	},
};

export const CountryChange: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const countrySelect = canvas.getByRole('combobox', { name: /country/i });
		await userEvent.click(countrySelect);

		await waitFor(
			() => {
				expect(
					document.body.querySelector('.ant-select-dropdown'),
				).toBeTruthy();
			},
			{ timeout: 2000 },
		);

		await userEvent.keyboard('{ArrowDown}{Enter}');
	},
};

// Test form submission handler
export const FormSubmission: Story = {
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement);

		await userEvent.type(
			canvas.getByLabelText(/Address Line 1/i),
			'123 Main St',
		);
		await userEvent.type(canvas.getByLabelText(/City/i), 'Toronto');

		const countrySelect = canvas.getByRole('combobox', { name: /country/i });
		await userEvent.click(countrySelect);
		await userEvent.click(canvas.getByText('Canada'));

		const stateSelect = canvas.getByRole('combobox', {
			name: /state \/ province/i,
		});
		await userEvent.click(stateSelect);
		await userEvent.click(canvas.getByText('Ontario'));

		await userEvent.type(canvas.getByLabelText(/Zip Code/i), 'M1A1A1');
		await userEvent.click(
			canvas.getByRole('button', { name: /save and continue/i }),
		);

		await waitFor(
			() => {
				expect(args.onSaveAndContinue).toHaveBeenCalled();
			},
			{ timeout: 2000 },
		);
	},
};
