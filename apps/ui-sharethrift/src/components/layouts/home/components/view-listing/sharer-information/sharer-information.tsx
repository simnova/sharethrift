import { Button, Avatar, Row, Col } from 'antd';
import { useEffect, useState } from 'react';
import { MessageOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import { CreateConversationDocument, HomeConversationListContainerConversationsByUserDocument } from '../../../../../../generated.tsx';
import type {
	CreateConversationMutation,
	CreateConversationMutationVariables,
} from '../../../../../../generated.tsx';
import { BlockListingButton } from '../block-listing.container.tsx';

type Sharer = {
	id: string;
	name: string;
	avatar?: string;
};

interface SharerInformationProps {
	sharer: Sharer;
	listingId: string;
	isOwner?: boolean;
	sharedTimeAgo?: string;
	className?: string;
	currentUserId?: string | null;
	isAdmin?: boolean;
    isBlocked?: boolean;
    sharerName?: string;
    listingTitle?: string;
}

export const SharerInformation: React.FC<SharerInformationProps> = ({
	sharer,
	listingId,
	isOwner = false,
	sharedTimeAgo = '2 days ago',
	className = '',
	currentUserId,
	isAdmin,
    isBlocked = false,
    sharerName,
    listingTitle = ''

}) => {
	const [isMobile, setIsMobile] = useState(false);
	const navigate = useNavigate();

	const [createConversation, { loading: isCreating }] = useMutation<
		CreateConversationMutation,
		CreateConversationMutationVariables
	>(CreateConversationDocument, {
		refetchQueries: [
			{
				query: HomeConversationListContainerConversationsByUserDocument,
				variables: { userId: currentUserId },
			}
		],
		awaitRefetchQueries: true,
		onCompleted: (data) => {
			if (data.createConversation.status.success) {
				navigate('/messages', {
					state: {
						selectedConversationId: data.createConversation.conversation?.id,
					},
					replace: false,
				});
			} else {
				console.log('Failed to create conversation:', data.createConversation.status.errorMessage);
			}
		},
		onError: (error) => {
			console.error('Error creating conversation:', error);
		},
	});

    const handleMessageSharer = async () => {
        if (!currentUserId) {
            return;
        }
        
        try {
            await createConversation({
                variables: {
                    input: {
                        listingId,
                        sharerId: sharer.id,
                        reserverId: currentUserId,
                    },
                },
            });
        } catch (error) {
            console.error('Failed to create conversation:', error);
        }
    };

	useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth <= 600);
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	return (
		<Row align="middle" gutter={4} className={className}>
			<Col
				style={{
					minWidth: 56,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'flex-start',
				}}
			>
				<Avatar
					style={{
						backgroundColor: 'var(--color-foreground-2)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						flexShrink: 0,
						fontFamily: 'var(--Urbanist, Arial, sans-serif)',
					}}
					size={48}
					icon={
						<svg
							width="24"
							height="24"
							viewBox="0 0 29 28"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							style={{ display: 'block', margin: 'auto' }}
						>
							<title>Sharethrift Logo</title>
							<path
								d="M13.5528 28C12.6493 28 11.7389 27.8973 10.8217 27.692C9.9045 27.4866 8.96675 27.1923 8.00848 26.809C8.33703 23.4961 9.29531 20.4022 10.8833 17.5274C12.4713 14.6525 14.5111 12.1199 17.0026 9.9296C13.9909 11.4628 11.383 13.4889 9.17894 16.0078C6.9749 18.5267 5.43481 21.4016 4.55867 24.6323C4.44915 24.5502 4.34648 24.4612 4.25065 24.3654L3.94263 24.0574C2.6558 22.7705 1.67699 21.3331 1.00619 19.7451C0.335398 18.1571 0 16.5007 0 14.7758C0 12.914 0.369622 11.1343 1.10887 9.43677C1.84811 7.73924 2.87484 6.23338 4.18905 4.91917C6.10561 3.00261 8.48077 1.66102 11.3145 0.894394C14.1483 0.127771 17.9746 -0.146023 22.7934 0.0730117C23.5052 0.100391 24.1623 0.257823 24.7647 0.545306C25.367 0.83279 25.9009 1.20926 26.3664 1.67471C26.8318 2.14016 27.2014 2.6809 27.4752 3.29694C27.749 3.91297 27.9133 4.57692 27.9681 5.28879C28.1323 10.2171 27.8449 14.0639 27.1056 16.8292C26.3664 19.5945 25.0522 21.9218 23.163 23.811C21.8214 25.1525 20.3224 26.1861 18.6659 26.9117C17.0095 27.6372 15.3051 28 13.5528 28Z"
								fill="var(--color-foreground-1)"
							/>
						</svg>
					}
				>
					{sharer.name.charAt(0).toUpperCase()}
				</Avatar>
			</Col>
			<Col flex="auto">
				<div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
					<h2 className="truncate" style={{ marginBottom: 0 }}>
						{sharer.name}
					</h2>
					<p className="truncate" style={{ marginTop: 2 }}>
						shared {sharedTimeAgo}
					</p>
				</div>
			</Col>
			<Col>
				{!isOwner && currentUserId && (
					<Button
						className="secondaryButton"
						type="default"
						icon={<MessageOutlined />}
						loading={isCreating}
						onClick={handleMessageSharer}
					>
						{!isMobile && 'Message Sharer'}
					</Button>
				)}
			</Col>
			<Col>
				{isAdmin && (
					<BlockListingButton
						listingId={listingId}
						listingTitle={listingTitle}
						isBlocked={isBlocked}
						sharerName={sharerName}
						renderModals={true}
					/>
				)}
			</Col>
		</Row>
	);
};
