import React from "react";
import { ProfilePhotoUpload, AuthResult } from "./profile-photo-upload";
import { PhotoUploadContainerUserCreateAuthHeaderForProfilePhotoDocument } from "../../../../generated";
import { useMutation } from "@apollo/client";
import { Image } from "antd";

export const ProfilePhotoUploadContainer: React.FC<any> = (props) => {
  const [createAuthHeaderForProfilePhoto] = useMutation(PhotoUploadContainerUserCreateAuthHeaderForProfilePhotoDocument);
  const blobPath = 'https://sharethrift.blob.core.windows.net/public';
  const [imageUrl,setImageUrl] = React.useState(`${blobPath}/${props.userId}`);
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

  function getBase64(img:Blob, callback:any) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }


  const handleChange = (info:any) => {
    if(info.file.status === 'uploading'){
      console.log('uploading');
    }
    if(info.file.status === 'done'){
      console.log('done');
      getBase64(info.file.originFileObj, (url:string) => {
        console.log("imageUrl:",url);
        setImageUrl(url);
      });
    }
  }

  return (
    <>
    <Image src={imageUrl} style={{maxWidth:'200px', maxHeight:'200px'}} className='rounded-full' /><br/>

    <ProfilePhotoUpload
     blobPath={blobPath}
     authorizeRequest={handleAuthorizeRequest}
     defaultImage={`${blobPath}/${props.userId}`}
     onChange={handleChange}
    />
    </>
  )
}