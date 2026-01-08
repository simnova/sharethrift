import type { Meta, StoryObj } from '@storybook/react';
import { MockedProvider } from '@apollo/client/testing/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { expect, within } from 'storybook/test';
import { HomeViewUserProfileContainerUserByIdDocument } from '../../../../../generated.tsx';
import { UserProfileViewContainer } from './user-profile-view.container.tsx';

const meta: Meta<typeof UserProfileViewContainer> = {
	title: 'Layouts/Home/ViewUserProfile/UserProfileViewContainer',
	component: UserProfileViewContainer,
	tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof UserProfileViewContainer>;

export const MissingUserId: Story = {
	render: () => (
		<MockedProvider>
			<MemoryRouter>
				<UserProfileViewContainer />
			</MemoryRouter>
		</MockedProvider>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByText('User ID is required')).toBeInTheDocument();
	},
};

export const WithProfileData: Story = {
	render: () => (
		<MockedProvider
			mocks={[
				{
					request: {
						query: HomeViewUserProfileContainerUserByIdDocument,
						variables: { userId: '507f1f77bcf86cd799439011' },
					},
					result: {
						data: {
							userById: {
								__typename: 'PersonalUser',
								id: '507f1f77bcf86cd799439011',
								userType: 'personal-user',
								createdAt: '2025-01-01T00:00:00.000Z',
								account: {
									__typename: 'PersonalUserAccount',
									accountType: 'personal',
									username: 'alice_doe',
									profile: {
										__typename: 'PersonalUserAccountProfile',
										firstName: 'Alice',
										lastName: 'Doe',
										aboutMe: 'Hello there',
										location: {
											__typename: 'PersonalUserAccountProfileLocation',
											city: 'Seattle',
											state: 'WA',
										},
									},
								},
							},
						},
					},
				},
			]}
		>
			<MemoryRouter initialEntries={['/user/507f1f77bcf86cd799439011']}>
				<Routes>
					<Route path="/user/:userId" element={<UserProfileViewContainer />} />
				</Routes>
			</MemoryRouter>
		</MockedProvider>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(await canvas.findByText('@alice_doe')).toBeInTheDocument();
		await expect(await canvas.findByText(/Seattle/i)).toBeInTheDocument();
	},
};
