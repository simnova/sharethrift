import type { Meta, StoryObj } from '@storybook/react';
import SelectAccountTypePage from './select-account-type-page.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../test-utils/storybook-decorators.tsx';
import { SelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument, SelectAccountTypeContainerAccountPlansDocument } from '../../../../generated.tsx';

const meta: Meta<typeof SelectAccountTypePage> = {
	title: 'Pages/Signup/SelectAccountTypePage',
	component: SelectAccountTypePage,
	parameters: {
		layout: 'fullscreen',
		apolloClient: {
			mocks: [
				{
					request: {
						query: SelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument,
					},
					result: {
						data: {
							currentPersonalUserAndCreateIfNotExists: {
								__typename: 'PersonalUser',
								id: 'mock-user-id-1',
								account: {
									__typename: 'PersonalUserAccount',
									accountType: 'non-verified-personal',
								},
							},
						},
					},
				},
				{
					request: {
						query: SelectAccountTypeContainerAccountPlansDocument,
					},
					result: {
						data: {
							accountPlans: [
								{
									__typename: 'AccountPlan',
									name: 'non-verified-personal',
									description: 'Non-Verified Personal',
									billingPeriodLength: 0,
									billingPeriodUnit: 'month',
									billingAmount: 0,
									currency: 'USD',
									setupFee: 0,
									feature: {
										__typename: 'AccountPlanFeature',
										activeReservations: 0,
										bookmarks: 3,
										itemsToShare: 15,
										friends: 5,
									},
									status: null,
									cybersourcePlanId: null,
									id: '607f1f77bcf86cd799439001',
									schemaVersion: '1.0.0',
									createdAt: '2023-05-02T10:00:00.000Z',
									updatedAt: '2023-05-02T10:00:00.000Z',
								},
								{
									__typename: 'AccountPlan',
									name: 'verified-personal',
									description: 'Verified Personal',
									billingPeriodLength: 0,
									billingPeriodUnit: 'month',
									billingAmount: 0,
									currency: 'USD',
									setupFee: 0,
									feature: {
										__typename: 'AccountPlanFeature',
										activeReservations: 10,
										bookmarks: 10,
										itemsToShare: 30,
										friends: 10,
									},
									status: null,
									cybersourcePlanId: null,
									id: '607f1f77bcf86cd799439002',
									schemaVersion: '1.0.0',
									createdAt: '2023-05-02T10:00:00.000Z',
									updatedAt: '2023-05-02T10:00:00.000Z',
								},
								{
									__typename: 'AccountPlan',
									name: 'verified-personal-plus',
									description: 'Verified Personal Plus',
									billingPeriodLength: 12,
									billingPeriodUnit: 'month',
									billingAmount: 4.99,
									currency: 'USD',
									setupFee: 0,
									feature: {
										__typename: 'AccountPlanFeature',
										activeReservations: 30,
										bookmarks: 30,
										itemsToShare: 50,
										friends: 30,
									},
									status: 'active',
									cybersourcePlanId: 'cybersource_plan_001',
									id: '607f1f77bcf86cd799439000',
									schemaVersion: '1.0.0',
									createdAt: '2023-05-02T10:00:00.000Z',
									updatedAt: '2023-05-02T10:00:00.000Z',
								},
							],
						},
					},
				},
			],
		},
	},
	decorators: [withMockApolloClient, withMockRouter('/signup/profile-setup')],
};

export default meta;
type Story = StoryObj<typeof meta>;


// Simple story that renders the page wrapper component
// The page just returns <SelectAccountTypeContainer />, so this will test the wrapper's return statement
export const Default: Story = {};
