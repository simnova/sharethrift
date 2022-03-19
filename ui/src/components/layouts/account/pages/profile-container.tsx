import { message, PageHeader, Skeleton } from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import { ProfileContainerUserUpdateDocument, ProfileContainerUserDocument, UserUpdateInput } from '../../../../generated';
import { SubPageLayout } from '../sub-page-layout';
import { Profile } from './profile';
import { ProfilePhotoUploadContainer } from '../components/profile-photo-upload-container';

export const ProfileContainer: React.FC<any> = () => {
  const [updateProfile, {error}] = useMutation(ProfileContainerUserUpdateDocument);  
  const { data: userData, loading: userLoading, error: userError } = useQuery(ProfileContainerUserDocument);

  const handleSave = async (values: UserUpdateInput) => {
    values.id = userData!.currentUser!.id;
    try {
      await updateProfile({
        variables: {
          input:values
        }
      });
      message.success("Saved");
    } catch (saveError) {
      message.error(`Error updating user: ${JSON.stringify(saveError)}`);
    }
  }

  const content = () => {
    if(userLoading) {
      return <div><Skeleton active /></div>
    } else if(error || userError) {
      return <div>{error}{userError}</div>
    } else if(userData && userData.currentUser) {
      return <div>
        <Profile onSave={handleSave} data={userData?.currentUser} />
        <h2>Profile Image</h2>
        <ProfilePhotoUploadContainer userId={userData.currentUser.id} />
      </div>
    }else {
      return <div>No data</div>
    }
  }

  return (
    <SubPageLayout header={<PageHeader title="Profile" />}>
      {content()}
    </SubPageLayout>
  )
  
}