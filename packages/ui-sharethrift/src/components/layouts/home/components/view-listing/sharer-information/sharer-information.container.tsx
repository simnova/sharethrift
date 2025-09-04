import { useQuery, gql } from '@apollo/client';
import { SharerInformation } from './sharer-information';

const GET_SHARER_INFORMATION = gql`
  query ViewListingSharerInformationGetSharer($sharerId: ObjectID!) {
    personalUserById(id: $sharerId) {
      id
      account {
        username
        profile {
          firstName
          lastName
        }
      }
    }
  }
`;

interface PersonalUser {
  id: string;
  account: {
    username: string;
    profile: {
      firstName: string;
      lastName: string;
      location: {
        city: string;
        state: string;
        country: string;
      };
    };
  };
}

interface SharerQueryResponse {
  personalUserById: PersonalUser;
}

interface SharerInformationContainerProps {
  sharerId: string;
  listingId: string;
  isOwner?: boolean;
  sharedTimeAgo?: string;
  className?: string;
  showIconOnly?: boolean;
}

export default function SharerInformationContainer({ sharerId, listingId, isOwner, sharedTimeAgo, className }: SharerInformationContainerProps) {
  // If sharerId looks like a name (contains spaces or letters), use it directly
  // Otherwise, try to query for user data
  const isNameOnly = typeof sharerId === 'string' && (sharerId.includes(' ') || /^[a-zA-Z\s]+$/.test(sharerId));
  
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

  const { data, loading, error } = useQuery<SharerQueryResponse>(
    GET_SHARER_INFORMATION,
    {
      variables: { sharerId },
    }
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading sharer information</div>;
  if (!data?.personalUserById) return null;

  const sharer = {
    id: data.personalUserById.id,
    name: `${data.personalUserById.account.profile.firstName} ${data.personalUserById.account.profile.lastName}`,
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

