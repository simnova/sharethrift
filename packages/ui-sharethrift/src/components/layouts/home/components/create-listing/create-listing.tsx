import { Row, Col, Button, Form, Input, Select, DatePicker, Upload, Card, Typography, Space, message } from 'antd';
import { PlusOutlined, LeftOutlined } from '@ant-design/icons';
import type { DatePickerProps } from 'antd';

const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Text } = Typography;

export interface CreateListingFormData {
  title: string;
  description: string;
  category: string;
  location: string;
  sharingPeriod: [string, string];
  images: string[];
}

export interface CreateListingProps {
  categories: string[];
  isLoading: boolean;
  onSubmit: (data: CreateListingFormData, isDraft: boolean) => void;
  onCancel: () => void;
  uploadedImages: string[];
  onImageUpload: (file: File) => Promise<string>;
  onImageRemove: (imageUrl: string) => void;
}

export function CreateListing({
  categories,
  isLoading,
  onSubmit,
  onCancel,
  uploadedImages,
  onImageUpload,
  onImageRemove,
}: CreateListingProps) {
  const [form] = Form.useForm();
  const maxCharacters = 2000;

  const handleFormSubmit = (isDraft: boolean) => {
    form.validateFields()
      .then((values) => {
        const formData: CreateListingFormData = {
          title: values.title,
          description: values.description,
          category: values.category,
          location: values.location,
          sharingPeriod: values.sharingPeriod ? [
            values.sharingPeriod[0].toISOString(),
            values.sharingPeriod[1].toISOString()
          ] : ['', ''],
          images: uploadedImages,
        };
        onSubmit(formData, isDraft);
      })
      .catch((errorInfo) => {
        console.log('Validation failed:', errorInfo);
        if (!isDraft) {
          message.error('Please fill in all required fields to publish');
        }
      });
  };

  const customUpload = async ({ file, onSuccess, onError }: any) => {
    try {
      const imageUrl = await onImageUpload(file);
      onSuccess?.(imageUrl);
    } catch (error) {
      onError?.(error);
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const disabledDate: DatePickerProps['disabledDate'] = (current) => {
    // Disable dates before today
    return current && current.valueOf() < Date.now() - 24 * 60 * 60 * 1000;
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <Row gutter={[0, 24]} style={{ marginBottom: '32px' }}>
        <Col span={24}>
          <Button 
            type="text" 
            icon={<LeftOutlined />} 
            onClick={onCancel}
            style={{ padding: '4px 8px', marginBottom: '16px' }}
          >
            Back
          </Button>
          <Typography.Title level={2} style={{ margin: 0 }}>
            Create a Listing
          </Typography.Title>
        </Col>
      </Row>

      <Form
        form={form}
        layout="vertical"
        requiredMark="optional"
      >
        <Row gutter={36}>
          {/* Left Column - Images */}
          <Col xs={24} md={12}>
            <Card title="Images" style={{ height: 'fit-content' }}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Primary Image Preview */}
                {uploadedImages.length > 0 && (
                  <div>
                    <Text strong>Primary Image</Text>
                    <div 
                      style={{ 
                        width: '100%', 
                        height: '300px', 
                        border: '1px solid var(--color-foreground-2)', 
                        borderRadius: '8px',
                        backgroundImage: `url(${uploadedImages[0]})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative'
                      }}
                    >
                      <Button
                        type="text"
                        danger
                        onClick={() => onImageRemove(uploadedImages[0])}
                        style={{ 
                          position: 'absolute', 
                          top: '8px', 
                          right: '8px',
                          background: 'rgba(255, 255, 255, 0.9)'
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                )}

                {/* Additional Images */}
                {uploadedImages.length > 1 && (
                  <div>
                    <Text strong>Additional Images</Text>
                    <Row gutter={[8, 8]}>
                      {uploadedImages.slice(1).map((image, index) => (
                        <Col span={8} key={index + 1}>
                          <div 
                            style={{ 
                              width: '100%', 
                              height: '80px', 
                              border: '1px solid var(--color-foreground-2)', 
                              borderRadius: '4px',
                              backgroundImage: `url(${image})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              position: 'relative'
                            }}
                          >
                            <Button
                              type="text"
                              danger
                              size="small"
                              onClick={() => onImageRemove(image)}
                              style={{ 
                                position: 'absolute', 
                                top: '2px', 
                                right: '2px',
                                background: 'rgba(255, 255, 255, 0.9)',
                                minWidth: '20px',
                                height: '20px',
                                fontSize: '12px'
                              }}
                            >
                              ×
                            </Button>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}

                {/* Upload Button */}
                <Upload
                  customRequest={customUpload}
                  listType="picture-card"
                  showUploadList={false}
                  accept="image/*"
                  disabled={uploadedImages.length >= 5}
                >
                  {uploadedImages.length < 5 && uploadButton}
                </Upload>
                
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Upload up to 5 images. First image will be the primary image.
                </Text>
              </Space>
            </Card>
          </Col>

          {/* Right Column - Form */}
          <Col xs={24} md={12}>
            <Card title="Item Details">
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Form.Item
                  label="Title"
                  name="title"
                  rules={[
                    { required: true, message: 'Title is required' },
                    { max: 200, message: 'Title cannot exceed 200 characters' }
                  ]}
                >
                  <Input placeholder="Enter item title" />
                </Form.Item>

                <Form.Item
                  label="Location"
                  name="location"
                  rules={[
                    { required: true, message: 'Location is required' },
                    { max: 255, message: 'Location cannot exceed 255 characters' }
                  ]}
                >
                  <Input placeholder="Enter location" />
                </Form.Item>

                <Form.Item
                  label="Category"
                  name="category"
                  rules={[{ required: true, message: 'Category is required' }]}
                >
                  <Select placeholder="Select a category">
                    {categories.map((category) => (
                      <Select.Option key={category} value={category}>
                        {category}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Reservation Period"
                  name="sharingPeriod"
                  rules={[{ required: true, message: 'Reservation period is required' }]}
                >
                  <RangePicker
                    style={{ width: '100%' }}
                    placeholder={['Start date', 'End date']}
                    disabledDate={disabledDate}
                  />
                </Form.Item>

                <Form.Item
                  label="Description"
                  name="description"
                  rules={[
                    { required: true, message: 'Description is required' },
                    { max: maxCharacters, message: `Description cannot exceed ${maxCharacters} characters` }
                  ]}
                >
                  <TextArea
                    placeholder="Describe your item"
                    rows={6}
                    showCount={{
                      formatter: ({ count }) => `${count}/${maxCharacters}`,
                    }}
                  />
                </Form.Item>
              </Space>
            </Card>

            {/* Action Buttons */}
            <Row gutter={16} style={{ marginTop: '24px' }}>
              <Col>
                <Button onClick={onCancel} disabled={isLoading}>
                  Cancel
                </Button>
              </Col>
              <Col>
                <Button 
                  type="default" 
                  onClick={() => handleFormSubmit(true)}
                  loading={isLoading}
                >
                  Save as Draft
                </Button>
              </Col>
              <Col>
                <Button 
                  type="primary" 
                  onClick={() => handleFormSubmit(false)}
                  loading={isLoading}
                >
                  Publish
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </div>
  );
}