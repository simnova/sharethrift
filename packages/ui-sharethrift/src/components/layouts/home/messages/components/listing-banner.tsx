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



// Figma icon SVG (replace with the actual SVG if you have it)
function SwapIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="10" fill="var(--color-highlight)" stroke="var(--color-secondary)" strokeWidth="1" />
      <path d="M7 10h6M13 10l-2-2m2 2l-2 2" stroke="var(--color-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ListingBanner({ title, owner, period, status, imageUrl }: ListingBannerProps) {
  return (
    <Card
      bodyStyle={{ padding: 0 }}
      style={{
        background: 'var(--color-background-2)',
        border: 'none',
        borderRadius: 0,
        borderBottom: '1px solid var(--color-foreground-2)',
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
            style={{ borderRadius: 4, boxShadow: '0px 4px 5px 0px rgba(0,0,0,0.1)', background: 'var(--color-foreground-1)' }}
          />
        </Col>
        <Col flex="auto">
          <Row align="middle" gutter={24}>
            <Col flex="auto">
              <Typography.Title level={3} style={{ margin: 0, color: 'var(--color-primary)', fontFamily: 'Instrument Serif, serif', fontWeight: 400, fontSize: 36, lineHeight: '42px' }}>{title}</Typography.Title>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <span style={{ fontFamily: 'Urbanist, sans-serif', fontWeight: 600, fontSize: 14, color: 'var(--color-primary)', lineHeight: '20px', width: 64 }}>{owner}</span>
                <Tag color="var(--color-secondary)" style={{ borderRadius: 20, padding: '2px 8px', display: 'flex', alignItems: 'center', margin: 0 }}>
                  <SwapIcon />
                </Tag>
              </div>
            </Col>
            <Col>
              <div style={{ color: 'var(--color-tertiary)', fontFamily: 'Urbanist, sans-serif', fontSize: 14 }}>
                <p style={{ fontFamily: 'Urbanist, sans-serif', fontWeight: 600, lineHeight: '18px', color: 'var(--color-tertiary)', margin: 0, marginBottom: 2 }}>Request Period:</p>
                <span style={{ fontWeight: 400, lineHeight: '18px', color: 'var(--color-tertiary)', fontFamily: 'Urbanist, sans-serif' }}>{period}</span>
              </div>
            </Col>
            <Col>
              <Tag color="var(--color-secondary)" style={{ borderRadius: 20, padding: '8px 20px', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
                <Avatar shape="circle" size={14} src={img} style={{ background: 'transparent' }} />
                <span style={{ color: 'var(--color-background-2)', fontFamily: 'Urbanist, sans-serif', fontWeight: 600, fontSize: 12, lineHeight: '16px' }}>{status}</span>
              </Tag>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
}
