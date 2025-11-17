import { useQuery } from '@apollo/client/react';
import { SharerInformation } from './sharer-information.tsx';
import { ViewListingSharerInformationContainerPersonalUserByIdDocument } from '../../../../../../generated.tsx';

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
		ViewListingSharerInformationContainerPersonalUserByIdDocument,
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
	if (!data?.personalUserById) return null;

	const sharer = {
		id: data.personalUserById.id,
		name: `${data.personalUserById.account?.profile?.firstName ?? ''} ${data.personalUserById.account?.profile?.lastName ?? ''}`.trim(),
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
