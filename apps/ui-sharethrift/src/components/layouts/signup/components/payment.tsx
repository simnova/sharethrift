// import { Form, Input, Button, Card, Typography, Row, Col, Checkbox, Divider } from "antd";
// import { message } from "antd";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { SaveOutlined } from "@ant-design/icons";

// const { Title, Text } = Typography;

// interface BillingFormData {
//   cardNumber: string;
//   expirationDate: string;
//   securityCode: string;
//   firstName: string;
//   lastName: string;
//   emailAddress: string;
//   phoneNumber: string;
//   addressLine1: string;
//   addressLine2?: string;
//   city: string;
//   state: string;
//   country: string;
//   acceptAgreement: boolean;
// }

// export const Payment = () => {
//   const [form] = Form.useForm();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [saveOnlyLoading, setSaveOnlyLoading] = useState(false);
//   const [formTouched, setFormTouched] = useState(false);

//   // Save Changes: validate billing fields only, show success message if valid
//   const handleSaveOnly = async () => {
//     try {
//       const billingFields = [
//         "cardNumber",
//         "expirationDate",
//         "securityCode",
//         "firstName",
//         "lastName",
//         "emailAddress",
//         "phoneNumber",
//         "addressLine1",
//         "addressLine2",
//         "city",
//         "state",
//         "country",
//       ];
//       const values = await form.validateFields(billingFields);
//       setSaveOnlyLoading(true);
//       setTimeout(() => {
//         setSaveOnlyLoading(false);
//         message.success("Billing details saved.", 2);
//       }, 1000);
//       console.log("Billing information saved (Save Changes):", values);
//     } catch {
//       // Validation errors handled by form
//     }
//   };

//   // Save and Continue: validate all, show errors, navigate only if all valid
//   const handleSubmit = async (values: BillingFormData) => {
//     setLoading(true);
//     try {
//       await form.validateFields();
//       console.log("Billing information submitted:", values);
//       setTimeout(() => {
//         navigate("/signup/terms");
//         setLoading(false);
//       }, 1000);
//     } catch {
//       setLoading(false);
//     }
//   };

//   // Format card number: max 16 digits, insert spaces
//   const formatCardNumber = (value: string) => {
//     const v = value.replace(/\D/g, "").slice(0, 16);
//     return v.replace(/(.{4})/g, "$1 ").trim();
//   };

//   // Format expiration date: MM/YY, max 4 digits
//   const formatExpirationDate = (value: string) => {
//     const v = value.replace(/\D/g, "").slice(0, 4);
//     if (v.length >= 3) {
//       return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
//     }
//     return v;
//   };

//   // Track form touched for Save and Continue button
//   const handleFormChange = () => setFormTouched(true);

//   return (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         minHeight: "calc(100vh - 128px)",
//         padding: "20px",
//       }}
//     >
//       <Card
//         style={{
//           maxWidth: 500,
//           width: "100%",
//           backgroundColor: "transparent",
//           border: "none",
//         }}
//       >
//         <div style={{ textAlign: "center", marginBottom: "2rem" }}>
//           <Title
//             level={1}
//             className="title36"
//             style={{
//               textAlign: "center",
//               marginBottom: "32px",
//               color: "var(--color-message-text)",
//             }}
//           >
//             Billing Information
//           </Title>
//         </div>

//         <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off" onValuesChange={handleFormChange}>
//           {/* Card Information */}
//           <Row gutter={16}>
//             <Col span={24}>
//               <Form.Item
//                 label={<span style={{ color: "var(--color-message-text)" }}>Card Number</span>}
//                 name="cardNumber"
//                 rules={[
//                   { required: true, message: "Card number is required" },
//                   {
//                     pattern: /^(\d{4} ){3}\d{4}$/,
//                     message: "Please enter a valid card number",
//                   },
//                 ]}
//               >
//                 <Input
//                   placeholder="XXXX XXXX XXXX XXXX"
//                   maxLength={19}
//                   aria-label="Card Number"
//                   inputMode="numeric"
//                   onChange={(e) => {
//                     const formattedValue = formatCardNumber(e.target.value);
//                     form.setFieldsValue({ cardNumber: formattedValue });
//                   }}
//                   style={{ height: "40px" }}
//                 />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Row gutter={16}>
//             <Col xs={24} sm={12}>
//               <Form.Item
//                 label={<span style={{ color: "var(--color-message-text)" }}>Expiration Date</span>}
//                 name="expirationDate"
//                 rules={[
//                   { required: true, message: "Expiration date is required" },
//                   {
//                     pattern: /^(0[1-9]|1[0-2])\/\d{2}$/,
//                     message: "Please enter MM/YY format",
//                   },
//                 ]}
//               >
//                 <Input
//                   placeholder="MM/YY"
//                   maxLength={5}
//                   aria-label="Expiration Date"
//                   inputMode="numeric"
//                   onChange={(e) => {
//                     const formattedValue = formatExpirationDate(e.target.value);
//                     form.setFieldsValue({ expirationDate: formattedValue });
//                   }}
//                   style={{ height: "40px" }}
//                 />
//               </Form.Item>
//             </Col>
//             <Col xs={24} sm={12}>
//               <Form.Item
//                 label={<span style={{ color: "var(--color-message-text)" }}>Security Code</span>}
//                 name="securityCode"
//                 rules={[
//                   { required: true, message: "Security code is required" },
//                   {
//                     pattern: /^\d{3,4}$/,
//                     message: "Security code must be 3 or 4 digits",
//                   },
//                 ]}
//               >
//                 <Input placeholder="CVC" maxLength={4} aria-label="Security Code" inputMode="numeric" style={{ height: "40px" }} />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Row gutter={16}>
//             <Col xs={24} sm={12}>
//               <Form.Item
//                 label={<span style={{ color: "var(--color-message-text)" }}>First Name</span>}
//                 name="firstName"
//                 rules={[{ required: true, message: "First name is required" }]}
//               >
//                 <Input placeholder="John" style={{ height: "40px" }} />
//               </Form.Item>
//             </Col>
//             <Col xs={24} sm={12}>
//               <Form.Item
//                 label={<span style={{ color: "var(--color-message-text)" }}>Last Name</span>}
//                 name="lastName"
//                 rules={[{ required: true, message: "Last name is required" }]}
//               >
//                 <Input placeholder="Doe" style={{ height: "40px" }} />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Divider style={{ margin: "32px 0", borderColor: "var(--color-border)" }} />

//           {/* Contact Information */}
//           <Title level={3} style={{ color: "var(--color-message-text)", marginBottom: "16px" }}>
//             Contact
//           </Title>

//           <Form.Item
//             label={<span style={{ color: "var(--color-message-text)" }}>Email Address</span>}
//             name="emailAddress"
//             rules={[
//               { required: true, message: "Email address is required" },
//               { type: "email", message: "Please enter a valid email address" },
//             ]}
//           >
//             <Input placeholder="johndoe@gmail.com" style={{ height: "40px" }} />
//           </Form.Item>

//           <Form.Item
//             label={<span style={{ color: "var(--color-message-text)" }}>Phone Number</span>}
//             name="phoneNumber"
//             rules={[
//               { required: true, message: "Phone number is required" },
//               {
//                 pattern: /^[\d\s\-()+]+$/,
//                 message: "Please enter a valid phone number",
//               },
//             ]}
//           >
//             <Input placeholder="(302) 766-3711" style={{ height: "40px" }} />
//           </Form.Item>

//           <Divider style={{ margin: "32px 0", borderColor: "var(--color-border)" }} />

//           {/* Billing Address */}
//           <Title level={3} style={{ color: "var(--color-message-text)", marginBottom: "16px" }}>
//             Billing Address
//           </Title>

//           <Form.Item
//             label={<span style={{ color: "var(--color-message-text)" }}>Address Line 1</span>}
//             name="addressLine1"
//             rules={[{ required: true, message: "Address Line 1 is required" }]}
//           >
//             <Input placeholder="Address Line 1" style={{ height: "40px" }} />
//           </Form.Item>

//           <Form.Item label={<span style={{ color: "var(--color-message-text)" }}>Address Line 2</span>} name="addressLine2">
//             <Input placeholder="Address Line 2" style={{ height: "40px" }} />
//           </Form.Item>

//           <Row gutter={16}>
//             <Col xs={24} sm={8}>
//               <Form.Item
//                 label={<span style={{ color: "var(--color-message-text)" }}>City</span>}
//                 name="city"
//                 rules={[{ required: true, message: "City is required" }]}
//               >
//                 <Input placeholder="City" style={{ height: "40px" }} />
//               </Form.Item>
//             </Col>
//             <Col xs={24} sm={8}>
//               <Form.Item
//                 label={<span style={{ color: "var(--color-message-text)" }}>State</span>}
//                 name="state"
//                 rules={[{ required: true, message: "State is required" }]}
//               >
//                 <Input placeholder="State" style={{ height: "40px" }} />
//               </Form.Item>
//             </Col>
//             <Col xs={24} sm={8}>
//               <Form.Item
//                 label={<span style={{ color: "var(--color-message-text)" }}>Country</span>}
//                 name="country"
//                 rules={[{ required: true, message: "Country is required" }]}
//               >
//                 <Input placeholder="Country" style={{ height: "40px" }} />
//               </Form.Item>
//             </Col>
//           </Row>

//           <div
//             style={{
//               textAlign: "right",
//             }}
//           >
//             <Button
//               type="default"
//               onClick={handleSaveOnly}
//               loading={saveOnlyLoading}
//               size="large"
//               icon={<SaveOutlined />}
//               style={{
//                 borderRadius: "20px",
//                 height: "38px",
//                 borderColor: "var(--color-primary)",
//                 color: "var(--color-primary)",
//               }}
//             >
//               Save Changes
//             </Button>
//           </div>

//           <Divider style={{ margin: "32px 0", borderColor: "var(--color-border)" }} />

//           {/* Order Confirmation */}
//           <Title level={3} style={{ color: "var(--color-message-text)", marginBottom: "16px" }}>
//             Order Confirmation
//           </Title>

//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               marginBottom: "16px",
//             }}
//           >
//             <Text style={{ color: "var(--color-message-text)", fontSize: "16px" }}>Business Plus</Text>
//             <Text
//               style={{
//                 color: "var(--color-message-text)",
//                 fontSize: "16px",
//                 fontWeight: 600,
//               }}
//             >
//               $24.99/month
//             </Text>
//           </div>

//           <Form.Item
//             name="acceptAgreement"
//             valuePropName="checked"
//             rules={[
//               {
//                 required: true,
//                 message: "You must accept the agreement to continue",
//                 transform: (value) => value || undefined,
//                 type: "boolean",
//               },
//             ]}
//             style={{ marginBottom: "24px" }}
//           >
//             <Checkbox style={{ color: "var(--color-message-text)" }}>
//               I understand this amount will be charged once my identity or business is verified and the account goes live.
//             </Checkbox>
//           </Form.Item>

//           <Form.Item style={{ textAlign: "right", marginTop: "32px" }}>
//             <Button
//               type="primary"
//               htmlType="submit"
//               loading={loading}
//               size="large"
//               disabled={!formTouched}
//               style={{
//                 width: "200px",
//                 height: "38px",
//                 fontSize: "16px",
//                 fontWeight: 600,
//                 borderRadius: "20px",
//                 backgroundColor: "#2c3e50",
//                 borderColor: "#2c3e50",
//               }}
//             >
//               Save and Continue
//             </Button>
//           </Form.Item>
//         </Form>
//       </Card>
//     </div>
//   );
// };
