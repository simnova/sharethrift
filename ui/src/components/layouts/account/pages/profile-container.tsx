import { message, PageHeader, Skeleton } from "antd";
import { useMutation, useQuery } from "@apollo/client";
import { ProfileContainerUserUpdateDocument, ProfileContainerUserDocument, UserUpdateInput } from "../../../../generated";
import { SubPageLayout } from "../sub-page-layout";
import { Profile } from "./profile";

export const ProfileContainer: React.FC<any> = () => {
  const [updateProfile, { data, loading, error }] = useMutation(ProfileContainerUserUpdateDocument);  
  const { data: userData, loading: userLoading, error: userError } = useQuery(ProfileContainerUserDocument);

  const handleSave = async (values: UserUpdateInput) => {
    values.id = userData!.currentUser!.id;
    try {
      await updateProfile({
        variables: {
          input:values
        },
        refetchQueries: [
          {
            query:ProfileContainerUserDocument,
          }
        ]
      });
      message.success("Saved");
    } catch (error) {
      message.error(`Error updating user: ${JSON.stringify(error)}`);
    }
  }

  const content = () => {
    if(userLoading) {
      return <div><Skeleton active /></div>
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