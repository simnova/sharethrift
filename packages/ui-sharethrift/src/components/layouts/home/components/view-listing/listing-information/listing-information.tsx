import { Row, Col, DatePicker, Button } from "antd";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import type { ReservationRequestState } from "../../../../../../generated";
import { LoadingOutlined } from '@ant-design/icons';

export type ListingStatus =
  | "Active"
  | "Paused"
  | "Blocked"
  | "Cancelled"
  | "Expired";

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
  userRole: string;
  isAuthenticated: boolean;
  reservationRequestStatus: ReservationRequestState | null;
  onReserveClick?: () => void;
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
  className?: string;
  reservationDates?: {
    startDate: Date | null;
    endDate: Date | null;
  };
  onReservationDatesChange?: (dates: {
    startDate: Date | null;
    endDate: Date | null;
  }) => void;
  reservationLoading?: boolean;
}

export function ListingInformation({
  listing,
  onReserveClick,
  className = "",
  userRole,
  isAuthenticated,
  reservationRequestStatus,
  reservationDates,
  onReservationDatesChange,
  reservationLoading = false,
}: ListingInformationProps) {
  if (listing.status !== "Active") {
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

  // Determine the Reserve button state based on reservation status

  // Check if dates are selected for enabling the Reserve button
  const areDatesSelected =
    reservationDates?.startDate && reservationDates?.endDate;
  const isReserveButtonDisabled =
    !areDatesSelected || userRole === "sharer";

console.log("is authenticated", isAuthenticated);

  const handleDateRangeChange = (
    dates: [Dayjs | null, Dayjs | null] | null
  ) => {
    if (onReservationDatesChange) {
      if (dates && dates[0] && dates[1]) {
        onReservationDatesChange({
          startDate: dates[0].toDate(),
          endDate: dates[1].toDate(),
        });
      } else {
        onReservationDatesChange({
          startDate: null,
          endDate: null,
        });
      }
    }
    console.log("Selected dates:", dates);
  };

  return (
    <Row gutter={[0, 12]} style={{ width: "100%" }} className={className}>
      <Col span={24}>
        {/* Title at top, using title42 class */}
        <div className="title42">{listing.title}</div>
      </Col>
      <Col span={24}>
        {/* Location and Category */}
        <Row gutter={16} align="middle">
          <Col
            span={8}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <h5 style={{ marginBottom: 8, marginTop: 0, lineHeight: "18px" }}>
              Located in
            </h5>
            <h5 style={{ marginBottom: 0, marginTop: 0, lineHeight: "18px" }}>
              Category
            </h5>
          </Col>
          <Col
            span={16}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <div
              className="font-urbanist text-[14px] text-[rgba(0,0,0,0.85)]"
              style={{ marginBottom: 8, marginTop: 0, lineHeight: "18px" }}
            >
              <p style={{ marginBottom: 0, marginTop: 0, lineHeight: "18px" }}>
                {listing.location}
              </p>
            </div>
            <div
              className="font-urbanist text-[14px] text-[rgba(0,0,0,0.85)]"
              style={{ marginBottom: 0, marginTop: 0, lineHeight: "18px" }}
            >
              <p style={{ marginBottom: 0, marginTop: 0, lineHeight: "18px" }}>
                {listing.category}
              </p>
            </div>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        {/* Description */}
        <Row>
          <Col span={24}>
            <div
              className="font-urbanist text-[14px] text-[#333333] w-full max-w-[499px]"
              style={{ marginBottom: 8 }}
            >
              <p style={{ marginBottom: 8 }}>{listing.description}</p>
            </div>
          </Col>
        </Row>
        {/* Reservation Period Section - Only show if authenticated */}
          <Row style={{ marginTop: 16 }}>
            <Col span={24}>
              <h3 style={{ marginBottom: 8 }}>Reservation Period</h3>
              <DatePicker.RangePicker
                style={{ width: "100%" }}
                placeholder={["Start date", "End date"]}
                allowClear
                onChange={handleDateRangeChange}
                value={
                  reservationDates?.startDate && reservationDates?.endDate
                    ? [
                        dayjs(reservationDates.startDate),
                        dayjs(reservationDates.endDate),
                      ]
                    : null
                }
              />
            </Col>
          </Row>
      </Col>
      <Col span={24}>
        {/* Reserve Button - Only show if authenticated */}
        <Row>
          <Col span={24}>
            <Button
                type={reservationRequestStatus === 'Requested' ? 'default' : 'primary'}
                block
                onClick={onReserveClick}
                disabled={isReserveButtonDisabled}
                icon={reservationLoading ? <LoadingOutlined /> : undefined}
            >
                {reservationRequestStatus === "Requested" ? "Cancel Request" : "Reserve"}
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
