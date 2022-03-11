import { ProfilePhotoUpload, AuthResult } from "./profile-photo-upload";
import { PhotoUploadContainerUserCreateAuthHeaderForProfilePhotoDocument } from "../../../../generated";
import { useMutation } from "@apollo/client";

export const ProfilePhotoUploadContainer: React.FC<any> = (props) => {
  const [createAuthHeaderForProfilePhoto] = useMutation(PhotoUploadContainerUserCreateAuthHeaderForProfilePhotoDocument);
  const blobPath = 'https://sharethrift.blob.core.windows.net/public';
  const handleAuthorizeRequest = async (file:File): Promise<AuthResult>  => {
    const result = await createAuthHeaderForProfilePhoto({
      variables: {
        input: {
          contentType: file.type,
          contentLength: file.size
        }
      }
    });
    return result.data?((result.data.userCreateAuthHeaderForProfilePhoto)as AuthResult):{isAuthorized:false} as AuthResult;
  }

  return (
    <ProfilePhotoUpload
     blobPath={blobPath}
     authorizeRequest={handleAuthorizeRequest}
    />
  )
}