import { useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Upload,
  Avatar,
  Row,
  Col,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { UploadFile } from "antd";

const { Title } = Typography;

interface ProfileSetupFormData {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
}

export default function ProfileSetup() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleSubmit = (values: ProfileSetupFormData) => {
    console.log("Profile setup form submitted:", values);
    console.log("Avatar file:", fileList);
    // In a real app, this would save the profile data and avatar
    // For now, navigate to terms page
    navigate("/signup/terms");
  };

  const handleAvatarChange = (info: any) => {
    const latestFileList = info.fileList.slice(-1); // Keep only the latest file
    setFileList(latestFileList);

    // Show preview for the latest image file
    const fileObj = latestFileList[0]?.originFileObj;
    if (fileObj && (fileObj.type === "image/jpeg" || fileObj.type === "image/png")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarUrl(e.target?.result as string);
      };
      reader.readAsDataURL(fileObj);
    } else if (latestFileList.length === 0) {
      setAvatarUrl("");
    }
  };

  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      console.error("You can only upload JPG/PNG files!");
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      console.error("Image must smaller than 2MB!");
      return Upload.LIST_IGNORE;
    }
    return false; // Prevent actual upload for demo
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 128px)",
        padding: "20px",
      }}
    >
      <Card
        style={{
          maxWidth: 600,
          width: "100%",
          backgroundColor: "transparent",
          border: "none",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Title
            level={1}
            className="title36"
            style={{
              textAlign: "center",
              marginBottom: "32px",
              color: "var(--color-message-text)",
            }}
          >
            Profile Setup
          </Title>
        </div>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Avatar
            size={100}
            src={avatarUrl || undefined}
            style={{
              backgroundColor: "#f0f0f0",
              border: "3px solid #e0e0e0",
              marginBottom: "1rem",
              objectFit: "cover",
            }}
          />
          <div>
            <Upload
              name="avatar"
              listType="text"
              fileList={fileList}
              onChange={handleAvatarChange}
              beforeUpload={beforeUpload}
              showUploadList={false}
              accept="image/jpeg,image/png"
            >
              <Button
                type="default"
                icon={<UploadOutlined />}
                style={{
                  backgroundColor: "var(--color-secondary)",
                  borderColor: "var(--color-secondary)",
                  color: "white",
                  borderRadius: "20px",
                  paddingLeft: "20px",
                  paddingRight: "20px",
                }}
              >
                {avatarUrl ? "Change Image" : "Choose Image"}
              </Button>
            </Upload>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="First Name"
                name="firstName"
                style={{ marginBottom: 5 }}
              >
                <Input placeholder="Your First Name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Last Name"
                name="lastName"
                style={{ marginBottom: 5 }}
              >
                <Input placeholder="Your Last Name" />
              </Form.Item>
            </Col>
          </Row>

          <Title
            level={4}
            style={{ marginTop: "1.5rem", marginBottom: "1rem" }}
          >
            Location
          </Title>

          <Form.Item
            label="Address Line 1"
            name="addressLine1"
            rules={[{ required: true, message: "Address is required" }]}
          >
            <Input placeholder="Address Line 1" />
          </Form.Item>

          <Form.Item label="Address Line 2" name="addressLine2">
            <Input placeholder="Address Line 2" />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item
                label="City"
                name="city"
                rules={[{ required: true, message: "City is required" }]}
              >
                <Input placeholder="City" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                label="State"
                name="state"
                rules={[{ required: true, message: "State is required" }]}
              >
                <Input placeholder="State" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                label="Country"
                name="country"
                rules={[{ required: true, message: "Country is required" }]}
              >
                <Input placeholder="Country" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: "2rem", textAlign: "right" }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              style={{
                width: "180px",
                height: "38px",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              Save and Continue
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
