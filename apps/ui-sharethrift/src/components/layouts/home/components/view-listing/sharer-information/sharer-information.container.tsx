import { useQuery } from '@apollo/client/react';
import { SharerInformation } from './sharer-information.tsx';
import { ViewListingSharerInformationContainerUserByIdDocument } from '../../../../../../generated.tsx';

interface SharerInformationContainerProps {
	sharerId: string;
	listingId: string;
	isOwner?: boolean;
	sharedTimeAgo?: string;
	className?: string;
	showIconOnly?: boolean;
}

export const SharerInformationContainer: React.FC<
	SharerInformationContainerProps
> = ({ sharerId, listingId, isOwner, sharedTimeAgo, className }) => {
	const { data, loading, error } = useQuery(
		ViewListingSharerInformationContainerUserByIdDocument,
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
			/>
		);
	}

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error loading sharer information</div>;
	if (!data?.userById) return null;

	// Handle both PersonalUser and AdminUser
	let firstName = '';
	let lastName = '';

	if (data.userById.__typename === 'PersonalUser') {
		firstName = data.userById.account?.profile?.firstName ?? '';
		lastName = data.userById.account?.profile?.lastName ?? '';
	} else if (data.userById.__typename === 'AdminUser') {
		firstName = data.userById.account?.firstName ?? '';
		lastName = data.userById.account?.lastName ?? '';
	}

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
		/>
	);
};
