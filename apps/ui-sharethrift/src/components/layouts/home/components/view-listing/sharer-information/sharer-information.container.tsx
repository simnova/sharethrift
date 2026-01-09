import { useQuery } from '@apollo/client/react';
import { SharerInformation } from './sharer-information.tsx';
import { SharerInformationContainerDocument } from '../../../../../../generated.tsx';

interface SharerInformationContainerProps {
	sharerId: string;
	listingId: string;
	isOwner?: boolean;
	sharedTimeAgo?: string;
	className?: string;
	showIconOnly?: boolean;
	currentUserId?: string | null;
    isAdmin?: boolean;
    isBlocked?: boolean;
    sharerName?: string;
    listingTitle?: string;
}

export const SharerInformationContainer: React.FC<
	SharerInformationContainerProps
> = ({ sharerId, listingId, isOwner, sharedTimeAgo, className, currentUserId, isAdmin, isBlocked, sharerName, listingTitle }) => {
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
				isAdmin={isAdmin}
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
			isAdmin={isAdmin}
            isBlocked={isBlocked}
            sharerName={sharerName}
            listingTitle={listingTitle}
		/>
	);
};
