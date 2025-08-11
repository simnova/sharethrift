import { Card, Typography, Avatar, Tag, Row, Col } from 'antd';

// Listing banner assets (from Figma export)
const imgRectangle26 = "http://localhost:3845/assets/01578ef5d71b8fa8e18cc5f64d7def6801f92473.png";
const imgVector = "http://localhost:3845/assets/81bd1230e72d3487b6fee61e6048d2d127a87690.svg";
const img = "http://localhost:3845/assets/9846ff90b7c9c0832c8196bb932aaafe1745879d.svg";

export interface ListingBannerProps {
  title: string;
  owner: string;
  period: string;
  status: string;
  imageUrl?: string;
}


function Swap() {
  return (
    <Avatar shape="circle" size={20} style={{ background: '#fff', border: '1px solid #3f8176' }} src={imgVector} />
  );
}

export function ListingBanner({ title, owner, period, status, imageUrl }: ListingBannerProps) {
  return (
    <Card
      bodyStyle={{ padding: 0 }}
      style={{
        background: '#edeae0',
        border: 'none',
        borderRadius: 0,
        borderBottom: '1px solid #e0ddd2',
        marginBottom: 0,
        boxShadow: 'none',
      }}
    >
      <Row align="middle" gutter={24} style={{ padding: '16px 24px' }}>
        <Col>
          <Avatar
            shape="square"
            size={72}
            src={imageUrl || imgRectangle26}
            style={{ borderRadius: 4, boxShadow: '0px 4px 5px 0px rgba(0,0,0,0.1)', background: '#c4c4c4' }}
          />
        </Col>
        <Col flex="auto">
          <Row align="middle" gutter={24}>
            <Col flex="auto">
              <Typography.Title level={3} style={{ margin: 0, color: '#25322c', fontFamily: 'Instrument Serif, serif', fontWeight: 400, fontSize: 36, lineHeight: '42px' }}>{title}</Typography.Title>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <Typography.Text strong style={{ fontFamily: 'Urbanist, sans-serif', fontWeight: 600, fontSize: 14, color: '#25322c', lineHeight: '20px', width: 64 }}>{owner}</Typography.Text>
                <Tag color="#3f8176" style={{ borderRadius: 20, padding: '2px 8px', display: 'flex', alignItems: 'center', margin: 0 }}>
                  <Swap />
                </Tag>
              </div>
            </Col>
            <Col>
              <div style={{ color: '#5e5b51', fontFamily: 'Urbanist, sans-serif', fontSize: 14 }}>
                <Typography.Text strong style={{ fontWeight: 600, lineHeight: '18px', color: '#5e5b51' }}>Request Period:</Typography.Text>
                <br />
                <Typography.Text style={{ fontWeight: 400, lineHeight: '18px', color: '#5e5b51' }}>{period}</Typography.Text>
              </div>
            </Col>
            <Col>
              <Tag color="#3f5f76" style={{ borderRadius: 20, padding: '8px 20px', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
                <Avatar shape="circle" size={14} src={img} style={{ background: 'transparent' }} />
                <span style={{ color: '#edeae0', fontFamily: 'Urbanist, sans-serif', fontWeight: 600, fontSize: 12, lineHeight: '16px' }}>{status}</span>
              </Tag>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
}
