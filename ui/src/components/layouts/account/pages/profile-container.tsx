import { useMutation, useQuery } from "@apollo/client";
import { Profile } from "./profile";
import { ProfileContainerUserUpdateDocument, ProfileContainerUserDocument, UserUpdateInput } from "../../../../generated";
import { Layout, PageHeader } from "antd";

const { Header, Content } = Layout;

export const ProfileContainer: React.FC<any> = () => {
  const [updateProfile, { data, loading, error }] = useMutation(ProfileContainerUserUpdateDocument);  
  const { data: userData, loading: userLoading, error: userError } = useQuery(ProfileContainerUserDocument);
  if(loading || userLoading) {
    return <div>Loading...</div>
  } else if(error || userError) {
    return <div>{error}{userError}</div>
  } else {

    const handleSave = (values: UserUpdateInput) => {
      values.id = userData!.currentUser!.id;
      updateProfile({
        variables: {
          input:values
        }
      });
    }

    return <>
      <Header className="site-layout-background" style={{ padding: 0 }}>
        <PageHeader
        title="Profile"
        />
      </Header>
      <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
        <div className="site-layout-background" style={{ padding: 24, textAlign: 'center' }}>
          <h1>Profile Container</h1>
          <Profile onSave={handleSave} data={userData?.currentUser} />
        </div>
      </Content>
    </>
  }
}