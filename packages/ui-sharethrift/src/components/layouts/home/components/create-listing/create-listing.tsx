import { Row, Col, Button, Form, Input, Select, DatePicker, Typography, Space, message } from 'antd';
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
  onImageAdd: (imageUrl: string) => void;
  onImageRemove: (imageUrl: string) => void;
}

export function CreateListing({
  categories,
  isLoading,
  onSubmit,
  onCancel,
  uploadedImages,
  onImageAdd,
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

  const disabledDate: DatePickerProps['disabledDate'] = (current) => {
    // Disable dates before today
    return current && current.valueOf() < Date.now() - 24 * 60 * 60 * 1000;
  };

  return (
    <>
      <style>{`
        @media (max-width: 600px) {
          .create-listing-responsive {
            padding-left: 16px !important;
            padding-right: 16px !important;
            padding-top: 24px !important;
            padding-bottom: 24px !important;
          }
          .create-listing-main-responsive {
            flex-direction: column !important;
            gap: 0 !important;
            align-items: center !important;
          }
          .create-listing-images-responsive,
          .create-listing-form-responsive {
            width: 100% !important;
            max-width: 450px !important;
            margin-left: auto !important;
            margin-right: auto !important;
          }
          .create-listing-images-responsive {
            height: auto !important;
            min-height: 300px !important;
          }
        }
      `}</style>
      <Row
        style={{paddingLeft: 100, paddingRight: 100, paddingTop: 50, paddingBottom: 75, boxSizing: 'border-box', width: '100%' }}
        gutter={[0, 24]}
        className="create-listing-responsive"
      >
        {/* Header */}
        <Col span={24} style={{ marginBottom: 0, paddingBottom: 0 }}>
          <Button 
            type="text" 
            icon={<LeftOutlined />} 
            onClick={onCancel}
            style={{ padding: '4px 8px', marginBottom: '16px' }}
          >
            Back
          </Button>
          <div className="title42">
            Create a Listing
          </div>
        </Col>
        <Col span={24} style={{ marginTop: 0, paddingTop: 0 }}>
          <Form
            form={form}
            layout="vertical"
            requiredMark="optional"
          >
            <Row gutter={36} align="top" style={{ marginTop: 0, paddingTop: 0 }} className="create-listing-main-responsive">
              <Col xs={24} md={12} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', marginTop: 0, paddingTop: 0 }}>
                <div style={{ width: '100%', height: '100%', minHeight: '500px' }} className="create-listing-images-responsive">
                  
                  {/* Spacer to align with Item Details h1 */}
                  <div style={{ height: '24px', marginBottom: '16px' }}></div>

                  {/* Primary Image Preview - Full width */}
                  {uploadedImages.length > 0 && (
                    <div 
                      style={{ 
                        width: '100%', 
                        height: '400px',
                        border: '1px solid var(--color-foreground-2)', 
                        borderRadius: '8px',
                        backgroundImage: `url(${uploadedImages[0]})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                        marginBottom: '16px'
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
                  )}

                  {/* Additional Images */}
                  {uploadedImages.length > 1 && (
                    <div style={{ marginBottom: '16px' }}>
                      <Text strong style={{ marginBottom: '8px', display: 'block' }}>Additional Images</Text>
                      <Row gutter={[8, 8]}>
                        {uploadedImages.slice(1).map((image, index) => (
                          <Col span={8} key={`additional-image-${index + 1}`}>
                            <div 
                              style={{ 
                                width: '80px',
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

                  {/* Upload Button - Full width when no images */}
                  {uploadedImages.length === 0 && (
                    <div style={{ marginBottom: '16px' }}>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          files.forEach(file => {
                            const reader = new FileReader();
                            reader.onload = () => {
                              const result = reader.result as string;
                              onImageAdd(result);
                            };
                            reader.readAsDataURL(file);
                          });
                          // Reset input
                          e.target.value = '';
                        }}
                        style={{ display: 'none' }}
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        style={{
                          width: '100%',
                          height: '400px',
                          border: '2px dashed var(--color-foreground-2)',
                          borderRadius: '8px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'border-color 0.3s ease',
                          backgroundColor: 'var(--color-background-2)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--color-secondary)';
                          e.currentTarget.style.backgroundColor = 'rgba(63, 129, 118, 0.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--color-foreground-2)';
                          e.currentTarget.style.backgroundColor = 'var(--color-background-2)';
                        }}
                      >
                        <PlusOutlined style={{ fontSize: '48px', color: 'var(--color-foreground-2)', marginBottom: '16px' }} />
                        <div style={{ fontSize: '18px', fontWeight: '500', color: 'var(--color-message-text', marginBottom: '8px' }}>
                          Click to upload images
                        </div>
                        <div style={{ fontSize: '14px', color: 'var(--color-primary-disabled)' }}>
                          or drag and drop
                        </div>
                      </label>
                    </div>
                  )}

                  {/* Upload Button - Smaller when images exist */}
                  {uploadedImages.length > 0 && uploadedImages.length < 5 && (
                    <div style={{ marginBottom: '16px' }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              const result = reader.result as string;
                              onImageAdd(result);
                            };
                            reader.readAsDataURL(file);
                          }
                          // Reset input
                          e.target.value = '';
                        }}
                        style={{ display: 'none' }}
                        id="additional-image-upload"
                      />
                      <label
                        htmlFor="additional-image-upload"
                        style={{
                          display: 'inline-block',
                          width: '80px',
                          height: '80px',
                          border: '2px dashed var(--color-foreground-2)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          backgroundColor: 'var(--color-background-2)',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--color-secondary)';
                          e.currentTarget.style.backgroundColor = 'rgba(63, 129, 118, 0.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--color-foreground-2)';
                          e.currentTarget.style.backgroundColor = 'var(--color-background-2)';
                        }}
                      >
                        <PlusOutlined style={{ fontSize: '24px', color: 'var(--color-foreground-2)' }} />
                      </label>
                    </div>
                  )}
                  
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Upload up to 5 images. First image will be the primary image.
                  </Text>
                </div>
              </Col>

              {/* Right Column - Form */}
              <Col xs={24} md={12} style={{ marginTop: 0, paddingTop: 0 }} className="create-listing-form-responsive">
                <div>
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
                </div>

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
        </Col>
      </Row>
    </>
  );
}