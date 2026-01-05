import { useMutation, useQuery } from '@apollo/client/react';
import { UserAppeal } from './user-appeal.tsx';
import { message } from 'antd';
import { HomeAccountProfileUserAppealContainerCreateUserAppealRequestDocument, HomeAccountProfileUserAppealContainerGetUserAppealRequestsDocument } from '../../../../../../generated.tsx';
import { ComponentQueryLoader } from '@sthrift/ui-components';

export interface UserAppealContainerProps {
    userId: string;
}

export const UserAppealContainer: React.FC<
    Readonly<UserAppealContainerProps>
> = ({ userId }) => {
    const [createAppealMutation, { loading }] = useMutation(
        HomeAccountProfileUserAppealContainerCreateUserAppealRequestDocument,
    );

    const {
        data: appealData,
        loading: appealLoading,
        error: appealError,
    } = useQuery(HomeAccountProfileUserAppealContainerGetUserAppealRequestsDocument, {
        variables: { userId },
    })


    const handleSubmitAppeal = async (reason: string) => {
        try {
            // TODO: SECURITY - Need to fetch the actual blockerId from the backend
            // Currently using userId as a temporary fallback which is not correct
            // The backend should provide the blocker information or allow null blockerId
            // Issue: https://github.com/simnova/sharethrift/issues/XXX
            const effectiveBlockerId = userId;

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
        <ComponentQueryLoader
            loading={appealLoading}
            error={appealError}
            hasData={appealData}
            hasDataComponent={
                <UserAppeal
                    existingAppeal={appealData}
                    onSubmitAppeal={handleSubmitAppeal}
                    loading={appealLoading || loading}
                />
            }
        />
    );
};
