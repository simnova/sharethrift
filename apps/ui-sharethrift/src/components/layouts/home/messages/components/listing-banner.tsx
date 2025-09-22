import { Card, Typography, Avatar, Tag, Row, Col } from "antd";
import { SwapOutlined, AppstoreAddOutlined } from "@ant-design/icons";
import bikeListingImg from "@sthrift/ui-components/src/assets/item-images/bike-listing.png";

// Listing banner assets (from Figma export)
const imgRectangle26 = bikeListingImg;

export interface ListingBannerProps {
  title: string;
  owner: string;
  period: string;
  status: string;
  imageUrl?: string;
}

export function ListingBanner({
  title,
  owner,
  period,
  status,
  imageUrl,
}: ListingBannerProps) {
  return (
    <Card
      bodyStyle={{ padding: 0 }}
      style={{
        background: "var(--color-background-2)",
        border: "none",
        borderRadius: 0,
        borderBottom: "1px solid var(--color-foreground-2)",
        marginBottom: 0,
        boxShadow: "none",
      }}
    >
      <Row
        align="middle"
        gutter={24}
        className="listingBannerRow"
        style={{ padding: "16px 24px" }}
      >
        <Col>
          <Avatar
            shape="square"
            size={72}
            src={imageUrl || imgRectangle26}
            style={{
              borderRadius: 4,
              boxShadow: "0px 4px 5px 0px rgba(0,0,0,0.1)",
              background: "var(--color-foreground-1)",
            }}
          />
        </Col>
        <Col flex="auto">
          <Row align="middle" gutter={24} className="listingBannerContentRow">
            <Col flex="auto">
              <Typography.Title
                level={3}
                style={{
                  margin: 0,
                  color: "var(--color-primary)",
                  fontFamily: "Instrument Serif, serif",
                  fontWeight: 400,
                  fontSize: 36,
                  lineHeight: "42px",
                  textAlign: "left",
                }}
              >
                {title}
              </Typography.Title>
              <div
                className="listingBannerOwnerRow"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 4,
                }}
              >
                <span
                  style={{
                    fontFamily: "Urbanist, sans-serif",
                    fontWeight: 600,
                    fontSize: 14,
                    color: "var(--color-primary)",
                    lineHeight: "20px",
                  }}
                >
                  {owner}
                </span>
                <Tag className="sharerIcon">
                  <SwapOutlined />
                </Tag>
              </div>
            </Col>
            <Col>
              <div
                style={{
                  color: "var(--color-tertiary)",
                  fontFamily: "Urbanist, sans-serif",
                  fontSize: 14,
                }}
              >
                <p
                  style={{
                    fontFamily: "Urbanist, sans-serif",
                    fontWeight: 600,
                    lineHeight: "18px",
                    color: "var(--color-tertiary)",
                    margin: 0,
                    marginBottom: 2,
                  }}
                >
                  Request Period:
                </p>
                <span
                  style={{
                    fontWeight: 400,
                    lineHeight: "18px",
                    color: "var(--color-tertiary)",
                    fontFamily: "Urbanist, sans-serif",
                  }}
                >
                  {period}
                </span>
              </div>
            </Col>
            <Col>
              <Tag className="requestSubmitted">
                <AppstoreAddOutlined
                  style={{ color: "var(--color-background-2)", fontSize: 16 }}
                />
                {status}
              </Tag>
            </Col>
          </Row>
        </Col>
      </Row>
      <style>{`
        .listingBannerContentRow {
          gap: 8px !important;
        }
        @media (max-width: 576px) {
          .listingBannerRow {
            flex-direction: column !important;
            align-items: center !important;
            gap: 12px !important;
          }
          .listingBannerContentRow {
            flex-direction: column !important;
            align-items: center !important;
            gap: 8px !important;
          }
          .listingBannerOwnerRow {
            justify-content: center !important;
          }
          .ant-typography, .ant-typography h3 {
            text-align: center !important;
            font-size: 22px !important;
            line-height: 28px !important;
          }
        }
      `}</style>
    </Card>
  );
}
