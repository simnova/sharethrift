import type { Meta, StoryObj } from '@storybook/react';
import { MockedProvider } from '@apollo/client/testing';
import { Messages } from '../components/messages.tsx';
import { Navigation, Header, Footer } from '@sthrift/ui-components';
import {
	HomeConversationListContainerConversationsByUserDocument,
	ConversationBoxContainerConversationDocument,
	type Conversation,
} from '../../../../../generated.tsx';

// Mock data based on the existing mock conversations structure
const mockConversations: Conversation[] = [
	{
		__typename: 'Conversation',
		id: '64f7a9c2d1e5b97f3c9d0c01',
		twilioConversationId: 'CH123',
		createdAt: '2025-08-08T10:00:00Z',
		updatedAt: '2025-08-08T12:00:00Z',
		schemaVersion: '1',
		listing: {
			__typename: 'ItemListing',
			id: '64f7a9c2d1e5b97f3c9d0a41',
			title: 'City Bike',
			description: 'Perfect for city commuting and weekend rides. Well-maintained hybrid bike with 21 speeds.',
			category: 'Sports & Recreation',
			location: 'Philadelphia, PA',
			sharingPeriodStart: '2024-08-11T00:00:00Z',
			sharingPeriodEnd: '2024-12-23T00:00:00Z',
			state: 'Published',
			images: ['/assets/item-images/bike.png'],
			createdAt: '2024-08-01T00:00:00Z',
			updatedAt: '2024-08-01T00:00:00Z',
			schemaVersion: '1',
			reports: 0,
			sharer: {
				__typename: 'PersonalUser',
				id: '507f1f77bcf86cd799439011',
				userType: 'personal',
				isBlocked: false,
				hasCompletedOnboarding: true,
				schemaVersion: '1',
				createdAt: '2024-08-01T00:00:00Z',
				updatedAt: '2024-08-01T00:00:00Z',
				account: {
					__typename: 'PersonalUserAccount',
					accountType: 'email',
					email: 'alice@example.com',
					username: 'alice_johnson',
					profile: {
						__typename: 'PersonalUserAccountProfile',
						firstName: 'Alice',
						lastName: 'Johnson',
					},
				},
			},
		},
		sharer: {
			__typename: 'PersonalUser',
			id: '507f1f77bcf86cd799439011',
			userType: 'personal',
			isBlocked: false,
			hasCompletedOnboarding: true,
			schemaVersion: '1',
			createdAt: '2024-08-01T00:00:00Z',
			updatedAt: '2024-08-01T00:00:00Z',
			account: {
				__typename: 'PersonalUserAccount',
				accountType: 'email',
				email: 'alice@example.com',
				username: 'alice_johnson',
				profile: {
					__typename: 'PersonalUserAccountProfile',
					firstName: 'Alice',
					lastName: 'Johnson',
				},
			},
		},
		reserver: {
			__typename: 'PersonalUser',
			id: '507f1f77bcf86cd799439099',
			userType: 'personal',
			isBlocked: false,
			hasCompletedOnboarding: true,
			schemaVersion: '1',
			createdAt: '2024-08-01T00:00:00Z',
			updatedAt: '2024-08-01T00:00:00Z',
			account: {
				__typename: 'PersonalUserAccount',
				accountType: 'email',
				email: 'user123@example.com',
				username: 'current_user',
				profile: {
					__typename: 'PersonalUserAccountProfile',
					firstName: 'Current',
					lastName: 'User',
				},
			},
		},
		messages: [
			{
				__typename: 'Message',
				id: '64f7a9c2d1e5b97f3c9d0c09',
				twilioMessageSid: 'SM001',
				authorId: '507f1f77bcf86cd799439099',
				content: 'Hi Alice! I\'m interested in borrowing your bike. Is it still available?',
				createdAt: '2025-08-08T10:05:00Z',
			},
			{
				__typename: 'Message',
				id: '64f7a9c2d1e5b97f3c9d0c10',
				twilioMessageSid: 'SM002',
				authorId: '507f1f77bcf86cd799439011',
				content: 'Hi! Yes, it\'s still available. When would you like to pick it up?',
				createdAt: '2025-08-08T10:15:00Z',
			},
			{
				__typename: 'Message',
				id: '64f7a9c2d1e5b97f3c9d0c11',
				twilioMessageSid: 'SM003',
				authorId: '507f1f77bcf86cd799439099',
				content: 'Great! How about this Saturday morning around 10 AM?',
				createdAt: '2025-08-08T10:20:00Z',
			},
			{
				__typename: 'Message',
				id: '64f7a9c2d1e5b97f3c9d0c12',
				twilioMessageSid: 'SM004',
				authorId: '507f1f77bcf86cd799439011',
				content: 'Perfect! I\'ll be home then. My address is 123 Pine Street. I\'ll send you my phone number in case you need directions.',
				createdAt: '2025-08-08T10:25:00Z',
			},
			{
				__typename: 'Message',
				id: '64f7a9c2d1e5b97f3c9d0c13',
				twilioMessageSid: 'SM005',
				authorId: '507f1f77bcf86cd799439099',
				content: 'Sounds good! Looking forward to trying it out. Thanks!',
				createdAt: '2025-08-08T10:30:00Z',
			},
		],
	},
	{
		__typename: 'Conversation',
		id: '64f7a9c2d1e5b97f3c9d0c02',
		twilioConversationId: 'CH124',
		createdAt: '2025-08-07T09:00:00Z',
		updatedAt: '2025-08-08T11:30:00Z',
		schemaVersion: '1',
		listing: {
			__typename: 'ItemListing',
			id: '64f7a9c2d1e5b97f3c9d0a42',
			title: 'Professional Camera',
			description: 'Canon EOS R5 with various lenses. Perfect for events, portraits, and photography projects.',
			category: 'Electronics',
			location: 'Philadelphia, PA',
			sharingPeriodStart: '2024-08-11T00:00:00Z',
			sharingPeriodEnd: '2024-12-23T00:00:00Z',
			state: 'Published',
			images: ['/assets/item-images/camera.png'],
			createdAt: '2024-08-01T00:00:00Z',
			updatedAt: '2024-08-01T00:00:00Z',
			schemaVersion: '1',
			reports: 0,
			sharer: {
				__typename: 'PersonalUser',
				id: '507f1f77bcf86cd799439012',
				userType: 'personal',
				isBlocked: false,
				hasCompletedOnboarding: true,
				schemaVersion: '1',
				createdAt: '2024-08-01T00:00:00Z',
				updatedAt: '2024-08-01T00:00:00Z',
				account: {
					__typename: 'PersonalUserAccount',
					accountType: 'email',
					email: 'bob@example.com',
					username: 'bob_smith',
					profile: {
						__typename: 'PersonalUserAccountProfile',
						firstName: 'Bob',
						lastName: 'Smith',
					},
				},
			},
		},
		sharer: {
			__typename: 'PersonalUser',
			id: '507f1f77bcf86cd799439012',
			userType: 'personal',
			isBlocked: false,
			hasCompletedOnboarding: true,
			schemaVersion: '1',
			createdAt: '2024-08-01T00:00:00Z',
			updatedAt: '2024-08-01T00:00:00Z',
			account: {
				__typename: 'PersonalUserAccount',
				accountType: 'email',
				email: 'bob@example.com',
				username: 'bob_smith',
				profile: {
					__typename: 'PersonalUserAccountProfile',
					firstName: 'Bob',
					lastName: 'Smith',
				},
			},
		},
		reserver: {
			__typename: 'PersonalUser',
			id: '507f1f77bcf86cd799439099',
			userType: 'personal',
			isBlocked: false,
			hasCompletedOnboarding: true,
			schemaVersion: '1',
			createdAt: '2024-08-01T00:00:00Z',
			updatedAt: '2024-08-01T00:00:00Z',
			account: {
				__typename: 'PersonalUserAccount',
				accountType: 'email',
				email: 'user123@example.com',
				username: 'current_user',
				profile: {
					__typename: 'PersonalUserAccountProfile',
					firstName: 'Current',
					lastName: 'User',
				},
			},
		},
		messages: [
			{
				__typename: 'Message',
				id: '64f7a9c2d1e5b97f3c9d0c00',
				twilioMessageSid: 'SM006',
				authorId: '507f1f77bcf86cd799439099',
				content: 'Hi Bob! I\'m interested in borrowing your camera for a wedding this weekend. Is it available?',
				createdAt: '2025-08-07T09:15:00Z',
			},
			{
				__typename: 'Message',
				id: '64f7a9c2d1e5b97f3c9d0c01',
				twilioMessageSid: 'SM007',
				authorId: '507f1f77bcf86cd799439012',
				content: 'Hi! Yes, it\'s available. It comes with a 24-70mm lens and a 85mm portrait lens. Perfect for weddings!',
				createdAt: '2025-08-07T10:00:00Z',
			},
		],
	},
];

const mocks = [
	{
		request: {
			query: HomeConversationListContainerConversationsByUserDocument,
			variables: {
				userId: '507f1f77bcf86cd799439099',
			},
		},
		result: {
			data: {
				conversationsByUser: mockConversations,
			},
		},
	},
	...mockConversations.map(conversation => ({
		request: {
			query: ConversationBoxContainerConversationDocument,
			variables: {
				conversationId: conversation.id,
			},
		},
		result: {
			data: {
				conversation,
			},
		},
	})),
];

const meta: Meta<typeof Messages> = {
	title: 'Pages/Messages/MessagesPage',
	component: Messages,
	parameters: {
		layout: 'fullscreen',
	},
	decorators: [
		(Story) => (
			<MockedProvider mocks={mocks}>
				<div style={{ 
					height: '100vh', 
					width: '100vw',
					display: 'flex',
					flexDirection: 'column',
					overflow: 'hidden'
				}}>
					<Header
						isAuthenticated={true}
						onLogin={() => console.log('Login clicked')}
						onLogout={() => console.log('Logout clicked')}
						onSignUp={() => console.log('SignUp clicked')}
						onCreateListing={() => console.log('Create Listing clicked')}
					/>
					<div style={{
						display: 'flex',
						flex: 1,
						overflow: 'hidden'
					}}>
						<Navigation 
							isAuthenticated={true}
							selectedKey="messages"
							onNavigate={(route) => console.log('Navigate to:', route)}
							onLogout={() => console.log('Logout clicked')}
						/>
						<div style={{ 
							marginLeft: '240px',
                            marginTop: '64px',
							flex: 1,
							overflow: 'hidden'
						}}>
							<Story />
						</div>
					</div>
					<Footer
						onFacebookClick={() => console.log('Facebook clicked')}
						onTwitterClick={() => console.log('Twitter clicked')}
					/>
				</div>
			</MockedProvider>
		),
	],
};

export default meta;
type Story = StoryObj<typeof Messages>;

export const Default: Story = {
	args: {},
};
