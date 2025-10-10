import React, { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Divider,
  Row,
  Col,
  Space,
  Avatar,
  Upload,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
// Container hook removed; using container component.
import styles from "../components/settings-view.module.css";
import "@sthrift/ui-components/src/styles/theme.css";
import type {
  SettingsEditProps,
  SettingsUser,
} from "../components/settings-view.types.ts";

const { Title, Text } = Typography;
const { TextArea } = Input;

export const SettingsEdit: React.FC<SettingsEditProps> = ({
  user,
  onSave,
  onCancel,
  isSaving,
  isLoading,
}) => {
  const [form] = Form.useForm<SettingsUser>();
  const [fileList, setFileList] = React.useState<UploadFile[]>([]);

  // Set initial form values
  useEffect(() => {
    if (user) {
      form.setFieldsValue(user);
    }
  }, [user, form]);

  const handleProfileImageChange = (info: { fileList: UploadFile[] }) => {
    setFileList(info.fileList);
  };

  const handleBack = () => {
    onCancel();
  };

  if (isLoading) {
    return <div>Loading account settings...</div>;
  }

  return (
    <div className={styles["settingsContainer"]}>
      <div className={styles["settingsHeader"]}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          style={{ marginBottom: 16 }}
        >
          Back to Settings
        </Button>
        <Title level={1} className="title42">
          Edit Account Settings
        </Title>
      </div>
      <Divider style={{ margin: "8px 0" }} />

      <Form form={form} layout="vertical" onFinish={onSave}>
        {/* Profile Information Section */}
        <Card className={styles["sectionCard"]}>
          <Title level={2}>Profile Information</Title>

          <Row gutter={[16, 16]}>
            <Col xs={24} style={{ textAlign: "center", marginBottom: 16 }}>
              <Upload
                listType="picture-circle"
                fileList={fileList}
                onChange={handleProfileImageChange}
                beforeUpload={() => false}
                maxCount={1}
              >
                {fileList.length === 0 && (
                  <div>
                    <Avatar
                      size={100}
                      icon={<CameraOutlined />}
                      style={{ cursor: "pointer" }}
                    />
                    <div style={{ marginTop: 8 }}>
                      <Text type="secondary">Upload Photo</Text>
                    </div>
                  </div>
                )}
              </Upload>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[
                  { required: true, message: "First name is required" },
                  {
                    max: 100,
                    message: "First name cannot exceed 100 characters",
                  },
                ]}
              >
                <Input placeholder="Enter first name" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[
                  { required: true, message: "Last name is required" },
                  {
                    max: 100,
                    message: "Last name cannot exceed 100 characters",
                  },
                ]}
              >
                <Input placeholder="Enter last name" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Username"
                name="username"
                rules={[
                  { required: true, message: "Username is required" },
                  {
                    pattern: /^[a-zA-Z0-9_]+$/,
                    message:
                      "Username can only contain letters, numbers, and underscores",
                  },
                ]}
              >
                <Input placeholder="Enter username" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { required: true, message: "Email is required" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input placeholder="Enter email address" disabled />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label="About Me"
                name="aboutMe"
                rules={[
                  {
                    max: 500,
                    message: "About me cannot exceed 500 characters",
                  },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Tell us a bit about yourself..."
                  showCount
                  maxLength={500}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Location Section */}
        <Card className={styles["sectionCard"]} style={{ marginTop: 16 }}>
          <Title level={2}>Location</Title>

          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Form.Item
                label="Address Line 1"
                name={["location", "address1"]}
                rules={[
                  { max: 255, message: "Address cannot exceed 255 characters" },
                ]}
              >
                <Input placeholder="Enter street address" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label="Address Line 2"
                name={["location", "address2"]}
                rules={[
                  { max: 255, message: "Address cannot exceed 255 characters" },
                ]}
              >
                <Input placeholder="Apartment, suite, unit, etc. (optional)" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="City"
                name={["location", "city"]}
                rules={[
                  { max: 100, message: "City cannot exceed 100 characters" },
                ]}
              >
                <Input placeholder="Enter city" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="State/Province"
                name={["location", "state"]}
                rules={[
                  { max: 100, message: "State cannot exceed 100 characters" },
                ]}
              >
                <Input placeholder="Enter state or province" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Country"
                name={["location", "country"]}
                rules={[
                  { max: 100, message: "Country cannot exceed 100 characters" },
                ]}
              >
                <Input placeholder="Enter country" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Zip Code"
                name={["location", "zipCode"]}
                rules={[
                  { max: 20, message: "Zip code cannot exceed 20 characters" },
                ]}
              >
                <Input placeholder="Enter zip code" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Billing Information Section */}
        <Card className={styles["sectionCard"]} style={{ marginTop: 16 }}>
          <Title level={2}>Billing Information</Title>
          <Text type="secondary">
            Payment method and billing address management will be available
            soon.
          </Text>
        </Card>

        {/* Action Buttons */}
        <div style={{ marginTop: 24 }}>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={isSaving}
              size="large"
            >
              Save Changes
            </Button>
            <Button onClick={onCancel} size="large">
              Cancel
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};
