import { Button, message } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { AuthResult, AzureUpload } from '../../../ui/molecules/azure-upload';
export type { AuthResult } from "../../../ui/molecules/azure-upload";

export interface ListingDraftPhotoUploadProps {
  authorizeRequest: (file:File) => Promise<AuthResult>
  blobPath: string
  onChange?: (value:object) => void
  defaultImage?: string
}

export const ListingDraftPhotoUpload:React.FC<ListingDraftPhotoUploadProps> = (props) => {
  return(
    
    <AzureUpload
      data={{
        permittedContentTypes: ['image/jpeg', 'image/png', 'image/gif'],
        permittedExtensions: ['jpg', 'jpeg', 'png', 'gif'],
        maxFileSizeBytes: (.3 *  1024 * 1024), // .3MB,
        maxWidthOrHeight: 1024,
        blobPath: props.blobPath,
      }}
      authorizeRequest={props.authorizeRequest}
      onInvalidContentType={() => { message.error('Only images are permitted'); }}
      onInvalidContentLength={() => { message.error('File size is too large'); }}
      onSuccess={() => { message.success('File uploaded successfully'); }}
      onError={(file:File,error:any) => { message.error(`File did not upload, error: ${JSON.stringify(error)}`); }}
      cropperProps={{
        shape:'square',
        rotate:true
      }}
      uploadProps={{
        onChange:props.onChange,
        listType:'picture-card',
        defaultFileList: props.defaultImage ? [{url:props.defaultImage}] : undefined,
        maxCount:1,
      }}
    >
      <Button>
        <UploadOutlined /> Click to Upload
      </Button>
    </AzureUpload>
    
  )
}