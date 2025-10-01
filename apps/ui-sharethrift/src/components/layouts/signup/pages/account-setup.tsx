import { Form, Input, Button, Card, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const { Title } = Typography;

interface AccountSetupFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export const AccountSetup: React.FC = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (values: AccountSetupFormData) => {
    setSubmitting(true);
    try {
      console.log(values);
      // Simulate async operation
      // await apiCall(values);
      navigate("/signup/profile-setup");
    } finally {
      setSubmitting(false);
    }
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
          maxWidth: 500,
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
            Account Setup
          </Title>
        </div>

        <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
          <Form.Item
            label="Email"
            name="email"
            style={{ marginBottom: 12 }}
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input placeholder="johndoe@email.com" autoFocus aria-label="Email" autoComplete="email" />
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            style={{ marginBottom: 12 }}
            rules={[
              { required: true, message: "Username is required" },
              { min: 3, message: "Username must be at least 3 characters" },
              { max: 30, message: "Username must be less than 30 characters" },
              {
                pattern: /^[a-zA-Z0-9_]+$/,
                message: "Username can only contain letters, numbers, and underscores",
              },
            ]}
          >
            <Input placeholder="Your Username" aria-label="Username" autoComplete="username" />
          </Form.Item>

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
              loading={submitting}
              disabled={submitting}
            >
              Save and Continue
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
