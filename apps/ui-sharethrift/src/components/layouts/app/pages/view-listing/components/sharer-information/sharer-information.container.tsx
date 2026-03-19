import { useQuery } from '@apollo/client/react';
import { SharerInformationContainerDocument } from '../../../../../../../generated.tsx';
import { SharerInformation } from './sharer-information.tsx';

interface SharerInformationContainerProps {
	sharerId: string;
	listingId: string;
	isOwner?: boolean;
	sharedTimeAgo?: string;
	className?: string;
	showIconOnly?: boolean;
	currentUserId?: string | null;
}

export const SharerInformationContainer: React.FC<
	SharerInformationContainerProps
> = ({ sharerId, listingId, isOwner, sharedTimeAgo, className, currentUserId }) => {
	const { data, loading, error } = useQuery(
		SharerInformationContainerDocument,
		{
			variables: { sharerId },
		},
	);

	// If sharerId looks like a name (contains spaces or letters), use it directly
	// Otherwise, try to query for user data
	const isNameOnly =
		typeof sharerId === 'string' &&
		(sharerId.includes(' ') || /^[a-zA-Z\s]+$/.test(sharerId));

	if (isNameOnly) {
		const sharer = {
			id: sharerId,
			name: sharerId,
		};
		return (
			<SharerInformation
				sharer={sharer}
				listingId={listingId}
				isOwner={isOwner}
				sharedTimeAgo={sharedTimeAgo}
				className={className}
				currentUserId={currentUserId}
			/>
		);
	}

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error loading sharer information</div>;
	if (!data?.userById) return null;

	// Both PersonalUser and AdminUser now have the same profile structure
	const firstName = data.userById.account?.profile?.firstName ?? '';
	const lastName = data.userById.account?.profile?.lastName ?? '';

	const sharer = {
		id: data.userById.id,
		name: `${firstName} ${lastName}`.trim(),
	};

	return (
		<SharerInformation
			sharer={sharer}
			listingId={listingId}
			isOwner={isOwner}
			sharedTimeAgo={sharedTimeAgo}
			className={className}
			currentUserId={currentUserId}
		/>
	);
};
