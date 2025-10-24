import { Form, Input, Button, Card, Typography, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "react-oidc-context";
import { Footer, Header } from "@sthrift/ui-components";

const { Title } = Typography;

interface LoginFormData {
  username: string;
  password: string;
}

export const LoginSelection: React.FC = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogin = async (_values: LoginFormData, isAdmin: boolean) => {
    setSubmitting(true);
    try {
      // Store the portal type for OAuth config selection
      globalThis.sessionStorage.setItem(
        "loginPortalType",
        isAdmin ? "AdminPortal" : "UserPortal"
      );
      // Force page reload to apply new OAuth config
      globalThis.location.href = "/auth-redirect-login";
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleOnSignUp = () => {
    navigate("/auth-redirect");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header
        isAuthenticated={auth.isAuthenticated}
        onLogin={() => navigate("/login")}
        onLogout={() => {}}
        onSignUp={handleOnSignUp}
        onCreateListing={() => {}}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
          height: "100vh",
          paddingTop: 64,
        }}
      >
        <main style={{ width: "100%" }}>
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
                  Login
                </Title>
              </div>

              <Form
                form={form}
                layout="vertical"
                onFinish={(values) => handleLogin(values, false)}
                autoComplete="off"
              >
                <Form.Item
                  label="Username"
                  name="username"
                  style={{ marginBottom: 12 }}
                  rules={[{ required: true, message: "Username is required" }]}
                >
                  <Input
                    placeholder="Your Username"
                    autoFocus
                    aria-label="Username"
                    autoComplete="username"
                  />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  style={{ marginBottom: 12 }}
                  rules={[{ required: true, message: "Password is required" }]}
                >
                  <Input.Password
                    placeholder="Your Password"
                    aria-label="Password"
                    autoComplete="current-password"
                  />
                </Form.Item>

                <Form.Item style={{ marginTop: "2rem" }}>
                  <Space
                    style={{ width: "100%", justifyContent: "space-between" }}
                  >
                    <Button
                      type="default"
                      size="large"
                      style={{
                        width: "180px",
                        height: "38px",
                        fontSize: "16px",
                        fontWeight: 600,
                      }}
                      loading={submitting}
                      disabled={submitting}
                      onClick={() => {
                        form.validateFields().then((values) => {
                          handleLogin(values, true);
                        });
                      }}
                    >
                      Admin Login
                    </Button>
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
                      Personal Login
                    </Button>
                  </Space>
                </Form.Item>

                <div style={{ textAlign: "center", marginTop: "1rem" }}>
                  <Button type="link" onClick={handleBack}>
                    ← Back to Home
                  </Button>
                </div>
              </Form>
            </Card>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};
