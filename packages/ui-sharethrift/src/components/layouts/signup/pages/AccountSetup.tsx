import { Form, Input, Button, Card, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import "../../../../styles/theme.css";

const { Title } = Typography;

interface AccountSetupFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export default function AccountSetup() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = (values: AccountSetupFormData) => {
    console.log("Account setup form submitted:", values);
    // In a real app, this would save the account data
    // For now, navigate to profile setup
    navigate("/signup/profile-setup");
  };

  const validateConfirmPassword = (_: any, value: string) => {
    if (!value || form.getFieldValue("password") === value) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Passwords do not match"));
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
      <Card style={{ maxWidth: 500, width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1
            className="title36"
            style={{
              textAlign: "center",
              marginBottom: "32px",
              color: "var(--color-message-text)",
            }}
          >
            Account Setup
          </h1>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input placeholder="johndoe@email.com" />
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: "Username is required" },
              { min: 3, message: "Username must be at least 3 characters" },
              { max: 30, message: "Username must be less than 30 characters" },
              {
                pattern: /^[a-zA-Z0-9_]+$/,
                message:
                  "Username can only contain letters, numbers, and underscores",
              },
            ]}
          >
            <Input placeholder="Your Username" />
          </Form.Item>

          <Title
            level={4}
            style={{ marginTop: "1.5rem", marginBottom: "1rem" }}
          >
            Password
          </Title>

          <Form.Item
            label="Create Password"
            name="password"
            rules={[
              { required: true, message: "Password is required" },
              { min: 8, message: "Password must be at least 8 characters" },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message:
                  "Password must contain at least one uppercase letter, one lowercase letter, and one number",
              },
            ]}
          >
            <Input.Password placeholder="Create Password" />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[
              { required: true, message: "Please confirm your password" },
              { validator: validateConfirmPassword },
            ]}
          >
            <Input.Password placeholder="Confirm Password" />
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
            >
              Save and Continue
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
