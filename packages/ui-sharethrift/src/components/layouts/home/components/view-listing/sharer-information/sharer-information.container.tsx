// import { useQuery } from '@apollo/client';
// import GET_SHARER_INFORMATION from './sharer-information.graphql';
import { SharerInformation } from './sharer-information';

interface SharerInformationContainerProps {
  sharer: {
    id: string;
    name: string;
    avatar?: string;
  };
  listingId: string;
  isOwner?: boolean;
  sharedTimeAgo?: string;
  className?: string;
  showIconOnly?: boolean;
}

export default function SharerInformationContainer({ sharer, listingId, isOwner, sharedTimeAgo, className }: SharerInformationContainerProps) {
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

