import PropTypes from 'prop-types';
import { Upload } from 'antd';
import axios from 'axios';
import ImgCrop from 'antd-img-crop';
import imageCompression from 'browser-image-compression';

const ComponentProps = {
  data: PropTypes.shape({
    permittedContentTypes: PropTypes.arrayOf(PropTypes.string),
    
    permittedFileExtensions: PropTypes.arrayOf(PropTypes.string),
    maxFileSizeBytes: PropTypes.number,
    maxWidthOrHeight: PropTypes.number,
    blobPath: PropTypes.string.isRequired

  }),
  authorizeRequest: PropTypes.func.isRequired,
  onInvalidContentType: PropTypes.func,
  onInvalidContentLength: PropTypes.func,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  cropperProps: PropTypes.object,
  uploadProps: PropTypes.object,
}
export interface AuthResult {
  isAuthorized: boolean;
  authHeader: string;
  blobName: string;
  requestDate: string;
}
interface ComponentProp {
  data: {
    permittedContentTypes?: string[];
    permittedExtensions?: string[];
    maxFileSizeBytes?: number;
    maxWidthOrHeight?: number;
    notificationCount?: number;
  }    
  onInvalidContentType?: () => void
  onInvalidContentLength?: () => void
  onSuccess?: () => void
  onError?: (file:File,error:any) => void
  authorizeRequest: (file:File) => Promise<AuthResult>
  cropperProps?: object
  uploadProps?: object
}

export type AzureUploadProps = PropTypes.InferProps<typeof ComponentProps> & ComponentProp;


export const AzureUpload:React.FC<AzureUploadProps> = (props) => {
  
  const beforeUpload = async (file:File) => {
    const isValidContentType = props.data.permittedContentTypes && props.data.permittedContentTypes.includes(file.type);

    if (!isValidContentType) {
      if(props.onInvalidContentType) {props.onInvalidContentType() }
      return Upload.LIST_IGNORE;
    }
   
    if(file.type.startsWith('image/') && (props.data.maxFileSizeBytes || props.data.maxWidthOrHeight)) {
      try {
        console.log('beforeUpload:', file.size);
        var options:any = {};
        if(props.data.maxFileSizeBytes) { options.maxSizeMB = props.data.maxFileSizeBytes / 1024 / 1024; }
        if(props.data.maxWidthOrHeight) { options.maxWidthOrHeight = props.data.maxWidthOrHeight; }
        return await imageCompression(file, options);
      } catch (error) {
        console.error('cannot compress:',error);
      } 
    }
    console.log('afterCompress:', file.size);
    const isValidContentLength = props.data.maxFileSizeBytes && file.size <= props.data.maxFileSizeBytes;

    if (!isValidContentLength) {
      if(props.onInvalidContentLength) {props.onInvalidContentLength() }
    }
    return  isValidContentType && isValidContentLength ? true : Upload.LIST_IGNORE;    
  }

  const customizeUpload =  async (option:any) => {
    const result =  await props.authorizeRequest(option.file) as AuthResult;
    if(result && result.isAuthorized) {
      const {authHeader,blobName,requestDate} = result;
      try {
        var response = await axios.request({
          method: 'put',
          url: `${props.data.blobPath}/${blobName}`, 
          data: new Blob([option.file],{type:option.file.type}),
          headers: {
            ...option.headers,
            "Authorization": authHeader,
            "x-ms-blob-type": "BlockBlob",
            "x-ms-version": "2021-04-10",
            "x-ms-date": requestDate,
            "Content-Type": option.file.type, 
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            option.onProgress({percent:percentCompleted},option.file);
          }
        });
        option.onSuccess(response,option.file);
        if(props.onSuccess) {props.onSuccess() }
      } catch (uploadError) {
        if(props.onError) {props.onError(option.file,uploadError) }
        option.onError(uploadError,option.file);
      }
    } else {
    // not authorized - do nothing
    }
    return option;
  }
  const validFileExtensions = props.data.permittedExtensions?('.' + props.data.permittedExtensions.join(', .')):undefined;
  console.log('validFileExtensions',validFileExtensions);

  if(props.cropperProps) {
    return(
      <ImgCrop
        {...props.cropperProps}
        >
         <Upload
            accept={validFileExtensions}
            customRequest={customizeUpload}
            beforeUpload={beforeUpload}
          
            progress={{
              strokeColor: {
                '0%': '#108ee9',
                '100%': '#87d068',
              },
              strokeWidth: 3,
              format: percent => percent?`${parseFloat(percent.toFixed(2))}%`:''
            }}
            {...props.uploadProps}
          >
            {props.children}
          </Upload>
      </ImgCrop>
    )
  }
  return (
    <Upload
      accept={validFileExtensions}
      customRequest = {customizeUpload}
      beforeUpload={beforeUpload}
    
      progress={{
        strokeColor: {
          '0%': '#108ee9',
          '100%': '#87d068',
        },
        strokeWidth: 3,
        format: percent => percent?`${parseFloat(percent.toFixed(2))}%`:''
      }}
      {...props.uploadProps}
    >
      {props.children}
    </Upload>
  )
}