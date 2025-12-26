import { useMutation } from '@apollo/client/react';
import { UserAppeal } from './user-appeal.tsx';
import { message } from 'antd';
import { HomeAccountProfileUserAppealContainerCreateUserAppealRequestDocument } from '../../../../../../generated.tsx';

export interface UserAppealContainerProps {
	userId: string;
	isBlocked: boolean;
	blockerId?: string;
	existingAppeal?: {
		id: string;
		reason: string;
		state: 'REQUESTED' | 'ACCEPTED' | 'DENIED';
		createdAt: string;
	} | null;
}

export const UserAppealContainer: React.FC<
	Readonly<UserAppealContainerProps>
> = ({ userId, isBlocked, blockerId, existingAppeal }) => {
	const [createAppealMutation, { loading }] = useMutation(
		HomeAccountProfileUserAppealContainerCreateUserAppealRequestDocument,
	);

	const handleSubmitAppeal = async (reason: string) => {
		try {
			// TODO: SECURITY - Need to fetch the actual blockerId from the backend
			// Currently using userId as a temporary fallback which is not correct
			// The backend should provide the blocker information or allow null blockerId
			// Issue: https://github.com/simnova/sharethrift/issues/XXX
			const effectiveBlockerId = blockerId || userId;

			await createAppealMutation({
				variables: {
					input: {
						userId,
						reason,
						blockerId: effectiveBlockerId,
					},
				},
			});

			message.success(
				'Your appeal has been submitted successfully. An administrator will review it within 3-5 business days.',
			);
		} catch (error) {
			console.error('Failed to submit appeal:', error);
			message.error(
				'Failed to submit appeal. Please try again or contact support.',
			);
		}
	};

	return (
		<UserAppeal
			isBlocked={isBlocked}
			existingAppeal={existingAppeal}
			onSubmitAppeal={handleSubmitAppeal}
			loading={loading}
		/>
	);
};
