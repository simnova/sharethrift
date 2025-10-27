import React, { useState } from "react";
import {
  Card,
  Button,
  Avatar,
  Typography,
  Row,
  Col,
  Divider,
  Space,
  Tag,
} from "antd";
import { EditOutlined, LockOutlined } from "@ant-design/icons";
import type {
  SettingsViewProps,
  PlanOption,
  SettingsUser,
} from "../components/settings-view.types.ts";
import { Form, Input } from "antd";
import styles from "../components/settings-view.module.css";
import "@sthrift/ui-components/src/styles/theme.css";

const { Text } = Typography;

// Mock plan data - this would come from API in real implementation
const PLAN_OPTIONS: PlanOption[] = [
  {
    id: "non-verified-personal",
    name: "Non-Verified Personal",
    price: "$0/month",
    features: [
      "5 active reservations",
      "5 bookmarks",
      "15 items to share",
      "5 friends",
    ],
  },
  {
    id: "verified-personal",
    name: "Verified Personal",
    price: "$0/month",
    features: [
      "10 active reservations",
      "10 bookmarks",
      "30 items to share",
      "10 friends",
    ],
    isPopular: true,
  },
  {
    id: "verified-personal-plus",
    name: "Verified Personal Plus",
    price: "$4.99/month",
    features: [
      "30 active reservations",
      "30 bookmarks",
      "50 items to share",
      "30 friends",
    ],
  },
];

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onEditSection,
  onChangePassword,
  onSaveSection,
  isSavingSection,
}) => {
  // Track which section is in edit mode
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [profileForm] = Form.useForm<SettingsUser>();
  const [locationForm] = Form.useForm<SettingsUser>();
  // Selected plan state for inline plan editing
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingForm] = Form.useForm<{
    subscriptionId?: string;
    cybersourceCustomerId?: string;
  }>();
  const [passwordForm] = Form.useForm<{
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }>();

  const computedPlanOptions = React.useMemo(
    () =>
      PLAN_OPTIONS.map((plan) => {
        const effectiveSelection = selectedPlan ?? user.accountType ?? null;
        const isSelected =
          editingSection === "plan"
            ? effectiveSelection === plan.id
            : user.accountType === plan.id; // show persisted accountType outside edit
        return { ...plan, isSelected };
      }),
    [editingSection, selectedPlan, user.accountType]
  );

  const beginEdit = (section: string) => {
    setEditingSection(section);
    onEditSection(section);
    // Initialize forms with current data when entering edit mode
    if (section === "profile") {
      profileForm.setFieldsValue(user);
    }
    if (section === "location") {
      locationForm.setFieldsValue(user);
    }
    if (section === "plan") {
      // initialize transient selection from persisted accountType
      setSelectedPlan(user.accountType || null);
    }
    if (section === "billing") {
      billingForm.setFieldsValue({
        subscriptionId: user.billing?.subscriptionId,
        cybersourceCustomerId: user.billing?.cybersourceCustomerId,
      });
    }
    if (section === "password") {
      console.log("Initializing password form for editing");
      console.log("user:", user);
      passwordForm.setFieldsValue({
        currentPassword: user.password,
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  const cancelEdit = () => {
    if (editingSection === "plan") {
      // discard transient selection; rely on persisted value
      setSelectedPlan(null);
    }
    setEditingSection(null);
  };

  const saveProfile = async () => {
    try {
      const values = await profileForm.validateFields();
      await onSaveSection?.("profile", values);
      setEditingSection(null);
    } catch {}
  };

  const saveLocation = async () => {
    try {
      const values = await locationForm.validateFields();
      await onSaveSection?.("location", values.location || values);
      setEditingSection(null);
    } catch {}
  };

  const savePlan = async () => {
    if (!selectedPlan) return; // nothing selected
    await onSaveSection?.("plan", { accountType: selectedPlan });
    // after save, clear transient selection; outside edit mode computedPlanOptions uses updated user.accountType
    setEditingSection(null);
    setSelectedPlan(null);
  };

  const saveBilling = async () => {
    try {
      const values = await billingForm.validateFields();
      await onSaveSection?.("billing", values);
      setEditingSection(null);
    } catch {}
  };

  const savePassword = async () => {
    try {
      const values = await passwordForm.validateFields();
      if (values.newPassword !== values.confirmPassword) {
        passwordForm.setFields([
          { name: "confirmPassword", errors: ["Passwords do not match"] },
        ]);
        return;
      }
      await onSaveSection?.("password", values);
      setEditingSection(null);
    } catch {}
  };

  const renderProfileSection = () => (
    <Card className={styles["sectionCard"]}>
      <div className={styles["sectionHeader"]}>
        <h2>Profile Information</h2>
        {editingSection !== "profile" ? (
          <Button
            icon={<EditOutlined />}
            onClick={() => beginEdit("profile")}
            type="primary"
          >
            Edit Profile
          </Button>
        ) : (
          <Space>
            <Button onClick={saveProfile} type="primary">
              Save
            </Button>
            <Button onClick={cancelEdit}>Cancel</Button>
          </Space>
        )}
      </div>

      {editingSection !== "profile" ? (
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={6} className={styles["profileImageCol"]}>
            <Avatar className={styles["profileAvatar"]} />
          </Col>
          <Col xs={24} sm={18}>
            <Row>
              <Col xs={24} sm={12}>
                <div>
                  <Text className="label">First Name</Text>
                  <br />
                  <p>{user.firstName || "Not provided"}</p>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div>
                  <Text className="label">Last Name</Text>
                  <br />
                  <p>{user.lastName || "Not provided"}</p>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div>
                  <Text className="label">Username</Text>
                  <br />
                  <p>{user.username}</p>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div>
                  <Text className="label">Email</Text>
                  <br />
                  <p>{user.email}</p>
                </div>
              </Col>
              <Col xs={24}>
                <div>
                  <Text className="label">About Me</Text>
                  <br />
                  <p>{user.aboutMe || "Not provided"}</p>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      ) : (
        <Form form={profileForm} layout="vertical">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="username"
                label="Username"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, type: "email" }]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item name="aboutMe" label="About Me">
                <Input.TextArea rows={4} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      )}
    </Card>
  );

  const renderLocationSection = () => (
    <Card className={styles["sectionCard"]}>
      <div className={styles["sectionHeader"]}>
        <h2>Location</h2>
        {editingSection !== "location" ? (
          <Button
            icon={<EditOutlined />}
            onClick={() => beginEdit("location")}
            type="primary"
          >
            Edit Location
          </Button>
        ) : (
          <Space>
            <Button onClick={saveLocation} type="primary">
              Save
            </Button>
            <Button onClick={cancelEdit}>Cancel</Button>
          </Space>
        )}
      </div>
      {editingSection !== "location" ? (
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <div>
              <Text className="label">Address Line 1</Text>
              <br />
              <p>{user.location.address1 || "Not provided"}</p>
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <div>
              <Text className="label">Address Line 2</Text>
              <br />
              <p>{user.location.address2 || "Not provided"}</p>
            </div>
          </Col>
          <Col xs={24} sm={6}>
            <div>
              <Text className="label">City</Text>
              <br />
              <p>{user.location.city || "Not provided"}</p>
            </div>
          </Col>
          <Col xs={24} sm={6}>
            <div>
              <Text className="label">State</Text>
              <br />
              <p>{user.location.state || "Not provided"}</p>
            </div>
          </Col>
          <Col xs={24} sm={6}>
            <div>
              <Text className="label">Country</Text>
              <br />
              <p>{user.location.country || "Not provided"}</p>
            </div>
          </Col>
          <Col xs={24} sm={6}>
            <div>
              <Text className="label">Zip Code</Text>
              <br />
              <p>{user.location.zipCode || "Not provided"}</p>
            </div>
          </Col>
        </Row>
      ) : (
        <Form form={locationForm} layout="vertical">
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Form.Item name={["location", "address1"]} label="Address Line 1">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item name={["location", "address2"]} label="Address Line 2">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={6}>
              <Form.Item name={["location", "city"]} label="City">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={6}>
              <Form.Item name={["location", "state"]} label="State">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={6}>
              <Form.Item name={["location", "country"]} label="Country">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={6}>
              <Form.Item name={["location", "zipCode"]} label="Zip Code">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      )}
    </Card>
  );

  // Plan icons to match SelectAccountType.tsx
  const planIcons: Record<string, string> = {
    "non-verified-personal": "/assets/item-images/stool.png",
    "verified-personal": "/assets/item-images/armchair.png",
    "verified-personal-plus": "/assets/item-images/bubble-chair.png",
  };

  const renderPlanCard = (plan: PlanOption) => (
    <Card
      key={plan.id}
      className={`cursor-pointer transition-all duration-200 ${
        styles["planCard"]
      } ${plan.isSelected ? styles["selectedPlan"] : ""}`}
      style={{
        width: 340,
        position: "relative",
        border: plan.isSelected
          ? "2px solid var(--color-secondary)"
          : "1px solid var(--color-foreground-2)",
        borderRadius: "12px",
        overflow: "hidden",
        margin: "0 auto",
      }}
      bodyStyle={{
        padding: "10px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        height: "100%",
        position: "relative",
      }}
      // Optional: allow clicking anywhere on the card in edit mode
      onClick={() => {
        if (editingSection === "plan") {
          setSelectedPlan(plan.id);
        }
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          marginBottom: 12,
        }}
      >
        <h3
          className="font-bold text-secondary"
          style={{
            fontSize: "18px",
            fontWeight: 600,
            color: "var(--color-message-text)",
            textAlign: "left",
            margin: 0,
            flex: 1,
            minHeight: "48px",
            display: "flex",
            alignItems: "center",
          }}
        >
          {plan.name}
        </h3>
        {plan.isPopular && (
          <Tag color="blue" style={{ marginLeft: 8 }}>
            Popular
          </Tag>
        )}
        <div
          role="button"
          aria-pressed={plan.isSelected}
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation(); // prevent card click duplication
            if (editingSection === "plan") {
              setSelectedPlan(plan.id);
            }
          }}
          onKeyDown={(e) => {
            if (
              (e.key === "Enter" || e.key === " ") &&
              editingSection === "plan"
            ) {
              e.preventDefault();
              setSelectedPlan(plan.id);
            }
          }}
          style={{
            marginLeft: 8,
            border: `1px solid ${
              plan.isSelected ? "var(--color-secondary)" : "grey"
            }`,
            backgroundColor: plan.isSelected
              ? "var(--color-secondary)"
              : "transparent",
            borderRadius: "50%",
            width: 18,
            height: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "14px",
            fontWeight: "bold",
            zIndex: 1,
            cursor: editingSection === "plan" ? "pointer" : "default",
          }}
        >
          {plan.isSelected ? <span style={{ fontSize: 14 }}>✓</span> : null}
        </div>
      </div>

      <div
        style={{
          fontSize: "60px",
          marginBottom: "20px",
          height: 150,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={planIcons[plan.id]}
          alt={plan.name}
          style={{ height: 150, width: "auto", objectFit: "contain" }}
        />
      </div>

      <div
        className="font-bold text-secondary"
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          color: "var(--color-secondary)",
          marginBottom: "20px",
        }}
      >
        {plan.price}
      </div>

      <div
        style={{
          textAlign: "left",
          fontSize: "13px",
          lineHeight: "1.5",
          flex: 1,
          color: "var(--color-message-text)",
        }}
      >
        {plan.features.map((feature) => (
          <div key={feature} style={{ marginBottom: "6px" }}>
            • {feature}
          </div>
        ))}
      </div>

      {plan.isSelected && (
        <Tag
          color="green"
          className={styles["selectedTag"]}
          style={{ marginTop: 12 }}
        >
          Current Plan
        </Tag>
      )}
    </Card>
  );

  const renderPlanSection = () => (
    <Card className={styles["sectionCard"]}>
      <div className={styles["sectionHeader"]}>
        <h2>Plan</h2>
        {editingSection !== "plan" ? (
          <Button
            icon={<EditOutlined />}
            onClick={() => beginEdit("plan")}
            type="primary"
          >
            Edit Plan
          </Button>
        ) : (
          <Space>
            <Button
              onClick={savePlan}
              type="primary"
              loading={!!isSavingSection}
            >
              Save
            </Button>
            <Button onClick={cancelEdit}>Cancel</Button>
          </Space>
        )}
      </div>
      <div
        style={{
          display: "flex",
          gap: "12px",
          justifyContent: "center",
          flexWrap: "wrap",
          padding: "8px 0",
        }}
      >
        {computedPlanOptions.map((plan) => renderPlanCard(plan))}
      </div>
    </Card>
  );

  const renderBillingSection = () => {
    const billing = user.billing;
    return (
      <Card className={styles["sectionCard"]}>
        <div className={styles["sectionHeader"]}>
          <h2>Billing</h2>
          {editingSection !== "billing" ? (
            <Button
              icon={<EditOutlined />}
              onClick={() => beginEdit("billing")}
              type="primary"
            >
              Edit Billing
            </Button>
          ) : (
            <Space>
              <Button
                onClick={saveBilling}
                type="primary"
                loading={!!isSavingSection}
              >
                Save
              </Button>
              <Button onClick={cancelEdit}>Cancel</Button>
            </Space>
          )}
        </div>
        {editingSection !== "billing" ? (
          <Space
            direction="vertical"
            size="large"
            className={styles["billingInfo"]}
          >
            <div>
              <Text className="label">Subscription ID</Text>
              <br />
              <p>{billing?.subscriptionId || "Not provided"}</p>
            </div>
            <div>
              <Text className="label">Cybersource Customer ID</Text>
              <br />
              <p>{billing?.cybersourceCustomerId || "Not provided"}</p>
            </div>
            <div>
              <Text className="label">Payment Method</Text>
              <br />
              <p>No payment method on file</p>
            </div>
          </Space>
        ) : (
          <Form form={billingForm} layout="vertical" style={{ maxWidth: 480 }}>
            <Form.Item name="subscriptionId" label="Subscription ID">
              <Input placeholder="Enter subscription id" />
            </Form.Item>
            <Form.Item
              name="cybersourceCustomerId"
              label="Cybersource Customer ID"
            >
              <Input placeholder="Enter cybersource customer id" />
            </Form.Item>
            <p style={{ fontSize: 12 }}>
              Payment instrument management coming soon.
            </p>
          </Form>
        )}
      </Card>
    );
  };

  const renderPasswordSection = () => (
    <Card className={styles["sectionCard"]}>
      <div className={styles["sectionHeader"]}>
        <h2>Change Password</h2>
        {editingSection !== "password" ? (
          <Button
            icon={<EditOutlined />}
            onClick={() => beginEdit("password")}
            type="primary"
          >
            Edit Password
          </Button>
        ) : (
          <Space>
            <Button
              onClick={savePassword}
              type="primary"
              loading={!!isSavingSection}
            >
              Save
            </Button>
            <Button onClick={cancelEdit}>Cancel</Button>
          </Space>
        )}
      </div>
      {editingSection !== "password" ? (
        <Space direction="vertical" size="middle">
          <Text className="label">
            Use the Edit button to change your password.
          </Text>
          <Button
            type="primary"
            icon={<LockOutlined />}
            onClick={onChangePassword}
          >
            Change Password
          </Button>
        </Space>
      ) : (
        <Form form={passwordForm} layout="vertical" style={{ maxWidth: 480 }}>
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[{ required: true, min: 8 }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>
          <p style={{ fontSize: 12 }}>
            Password change will be processed after save (placeholder).
          </p>
        </Form>
      )}
    </Card>
  );

  return (
    <div className={styles["settingsContainer"]}>
      <div className={styles["settingsHeader"]}>
        <h1 className="title42">Account Settings</h1>
      </div>
      <Divider style={{ margin: "8px 0" }} />
      <div
        className={styles["sectionsContainer"]}
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
        <div style={{ marginBottom: 0 }}>{renderProfileSection()}</div>
        <Divider style={{ margin: "8px 0" }} />
        <div style={{ marginBottom: 0 }}>{renderLocationSection()}</div>
        <Divider style={{ margin: "8px 0" }} />
        <div style={{ marginBottom: 0 }}>{renderPlanSection()}</div>
        <Divider style={{ margin: "8px 0" }} />
        <div style={{ marginBottom: 0 }}>{renderBillingSection()}</div>
        <Divider style={{ margin: "8px 0" }} />
        <div style={{ marginBottom: 0 }}>{renderPasswordSection()}</div>
      </div>
    </div>
  );
};
