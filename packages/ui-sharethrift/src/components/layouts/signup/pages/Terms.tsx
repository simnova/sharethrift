import React from 'react';
import { Form, Button, Card, Typography, Checkbox, Radio, Space, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import '../../../styles/theme.css';

const { Title, Text, Link } = Typography;

interface AcceptTermsFormData {
  acceptTerms: boolean;
  listingNotifications: boolean;
  reservationNotifications: boolean;
  recommendations: string;
}

export default function Terms() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = (values: AcceptTermsFormData) => {
    console.log('Terms form submitted:', values);
    // In a real app, this would save the preferences and complete onboarding
    // For now, navigate to main app or success page
    navigate('/');
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'flex-start', 
      minHeight: 'calc(100vh - 128px)', 
      padding: '20px' 
    }}>
      <Card style={{ maxWidth: 700, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Title level={2}>Accept Terms</Title>
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <Title level={3}>Terms & Conditions</Title>
          <Text>
            By using this platform, you agree to the following terms and conditions 
            regarding all item lending and borrowing activities:
          </Text>
          
          <div style={{ 
            background: '#f8f9fa', 
            padding: '20px', 
            borderRadius: '8px', 
            margin: '20px 0',
            border: '1px solid #e9ecef'
          }}>
            <ol style={{ margin: 0, paddingLeft: '20px' }}>
              <li style={{ marginBottom: '12px' }}>
                <strong>Third-Party Agreements</strong><br />
                <Text type="secondary">
                  Our platform facilitates connections between users but does not 
                  participate in, review, or enforce any external agreements, contracts, or 
                  arrangements made between users, whether verbal or written.
                </Text>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <strong>No Liability for Off-Platform Actions</strong><br />
                <Text type="secondary">
                  Any legal agreements, safety provisions, item inspections, financial 
                  transactions, or dispute resolutions conducted outside of this platform are 
                  entirely the responsibility of the involved users. The platform is not liable for 
                  any loss, damage, injury, theft, or legal issue that arises from such off-platform interactions.
                </Text>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <strong>User Responsibility</strong><br />
                <Text type="secondary">
                  It is the sole responsibility of each user to ensure the safety, legality, and 
                  suitability of any items borrowed or lent. Users are also responsible for 
                  understanding and complying with local laws and regulations.
                </Text>
              </li>
            </ol>
            
            <div style={{ marginTop: '20px', padding: '15px', background: '#e3f2fd', borderRadius: '6px' }}>
              <strong>Additional Notes:</strong>
              <ul style={{ margin: '8px 0 0 20px' }}>
                <li>We encourage users to communicate clearly, inspect items carefully.</li>
                <li>By continuing to use this platform, you acknowledge that all item exchanges are done at your own risk.</li>
              </ul>
            </div>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="acceptTerms"
            valuePropName="checked"
            rules={[
              { 
                required: true, 
                message: 'You must accept the terms and conditions to continue',
                transform: (value) => value || undefined,
                type: 'boolean'
              }
            ]}
          >
            <Checkbox>I accept these Terms and Conditions</Checkbox>
          </Form.Item>

          <Divider />

          <Title level={3} style={{ marginTop: '2rem' }}>Communication Preferences</Title>
          
          <Title level={4} style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
            Listing Notifications
          </Title>
          <Form.Item
            name="listingNotifications"
            valuePropName="checked"
            initialValue={true}
          >
            <Checkbox>
              List notifications when someone requests to borrow an item, reminders 
              from ShareThrift about items you are lending out.
            </Checkbox>
          </Form.Item>

          <Title level={4} style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
            Reservations
          </Title>
          <Form.Item
            name="reservationNotifications"
            valuePropName="checked"
            initialValue={true}
          >
            <Checkbox>
              Reservation notifications on items you are requesting to borrow, 
              reminders from ShareThrift about items you are borrowing.
            </Checkbox>
          </Form.Item>

          <Title level={4} style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
            Recommendations
          </Title>
          <Form.Item
            name="recommendations"
            initialValue="yes"
          >
            <Radio.Group>
              <Space direction="vertical">
                <Radio value="yes">Get ShareThrift tips and recommendations.</Radio>
                <Radio value="no">No recommendations, please.</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>

          <Form.Item style={{ marginTop: '2rem' }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large"
              style={{ 
                width: '100%',
                height: '48px',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: 600
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
