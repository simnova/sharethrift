import { message, PageHeader, Skeleton, Row, Col, Descriptions } from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import { ProfileContainerUserUpdateDocument, ProfileContainerUserDocument, UserUpdateInput } from '../../../../generated';
import { SubPageLayout } from '../sub-page-layout';
import { Profile } from './profile';
import { ProfilePhotoUploadContainer } from '../components/profile-photo-upload-container';
import dayjs from "dayjs";

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
        <h1>Profile</h1>
        <Row>
          <Col span={8}>
            <div className='block text-center'>
              <ProfilePhotoUploadContainer userId={userData.currentUser.id} />
            </div>
            <Descriptions title="User Info" size={'middle'} layout={'vertical'} column={1}>
              <Descriptions.Item label="Id">{userData.currentUser.id}</Descriptions.Item>
              <Descriptions.Item label="Email">{userData.currentUser.email}</Descriptions.Item>
              <Descriptions.Item label="Created At">{dayjs(userData.currentUser.createdAt).format('DD/MM/YYYY')}</Descriptions.Item>
              <Descriptions.Item label="Updated At">{dayjs(userData.currentUser.updatedAt).format('DD/MM/YYYY')}</Descriptions.Item>
            </Descriptions>
           
          </Col>
          <Col span={16}> 
           <Profile onSave={handleSave} data={userData?.currentUser} />
          </Col>
        </Row>
        
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