import { Button, Row, Col, DatePicker } from 'antd';

export type ListingStatus = 'Active' | 'Paused' | 'Blocked' | 'Cancelled' | 'Expired';
export type UserRole = 'logged-out' | 'sharer' | 'reserver';
export type ReservationRequestStatus = 'pending' | 'accepted' | 'rejected' | 'closing' | 'closed';

export interface ListingInformationProps {
  listing: {
    id: string;
    title: string;
    itemName?: string;
    description: string;
    price?: number;
    priceUnit?: string;
    category: string;
    condition?: string;
    location: string;
    availableFrom: string;
    availableTo: string;
    status: ListingStatus;
  };
  userRole: UserRole;
  isAuthenticated: boolean;
  reservationRequestStatus?: ReservationRequestStatus;
  onReserveClick?: () => void;
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
  className?: string;
}
export function ListingInformation(props: ListingInformationProps) {
  const { listing } = props;
  if (listing.status !== 'Active') {
    return (
      <div className="p-4">
        <button
          type="button"
          disabled
          className="w-full bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold cursor-not-allowed"
        >
          Listing Not Available
        </button>
      </div>
    );
  }

  return (
    <Row gutter={[0, 24]} style={{ width: '100%' }}>
      <Col span={24}>
        {/* Title at top, using title42 class */}
        <div className="title42">{listing.title}</div>
      </Col>
      <Col span={24}>
        {/* Location and Category */}
        <Row gutter={32}>
          <Col span={8} >
            <h5>Located in</h5>
            <h5>Category</h5>
          </Col>
          <Col span={16} className="flex flex-col gap-3">
            <div className="font-urbanist text-[14px] text-[rgba(0,0,0,0.85)]">
              <p>{listing.location}</p>
            </div>
            <div className="font-urbanist text-[14px] text-[rgba(0,0,0,0.85)]">
              <p>{listing.category}</p>
            </div>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        {/* Description */}
        <Row>
          <Col span={24}>
            <div className="font-urbanist text-[14px] text-[#333333] w-full max-w-[499px]">
              <p>{listing.description}</p>
            </div>
          </Col>
        </Row>
        {/* Reservation Period Section */}
        <Row style={{ marginTop: 32 }}>
          <Col span={24}>
            <h3>Reservation Period</h3>
            <DatePicker.RangePicker
              style={{
                width: '100%',
                // height: 44,
                // borderRadius: 8,
                // fontFamily: 'var(--Urbanist, Arial, sans-serif)',
                // fontSize: 14,
                // color: 'var(--color-message-text)',
                // backgroundColor: 'var(--color-background)',
                // border: '1px solid var(--color-foreground-2)',
                // boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
              placeholder={["Start date", "End date"]}
              allowClear
            />
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        {/* Reserve Button */}
        <Row>
          <Col span={24}>
            <Button type="primary" className="primaryButton" style={{ width: '100%' }}>
              Reserve
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}