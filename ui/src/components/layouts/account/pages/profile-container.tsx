import { PageHeader } from "antd";
import { useMutation, useQuery } from "@apollo/client";
import { ProfileContainerUserUpdateDocument, ProfileContainerUserDocument, UserUpdateInput } from "../../../../generated";
import { SubPageLayout } from "../sub-page-layout";
import { Profile } from "./profile";

export const ProfileContainer: React.FC<any> = () => {
  const [updateProfile, { data, loading, error }] = useMutation(ProfileContainerUserUpdateDocument);  
  const { data: userData, loading: userLoading, error: userError } = useQuery(ProfileContainerUserDocument);

  const handleSave = (values: UserUpdateInput) => {
    values.id = userData!.currentUser!.id;
    updateProfile({
      variables: {
        input:values
      }
    });
  }

  const content = () => {
    if(loading || userLoading) {
      return <div>Loading...</div>
    } else if(error || userError) {
      return <div>{error}{userError}</div>
    } else {
      return <Profile onSave={handleSave} data={userData?.currentUser} />
    }
  }

  return <>
    <SubPageLayout header={<PageHeader title="Profile" />}>
        {content()}
    </SubPageLayout>
  </>
  
}