// Shared type definitions for reservation components
export interface ReservationRequest {
  id: string;
  state: 'REQUESTED' | 'ACCEPTED' | 'REJECTED' | 'RESERVATION_PERIOD' | 'CANCELLED';
  reservationPeriodStart: string;
  reservationPeriodEnd: string;
  createdAt: string;
  updatedAt: string;
  listingId: string;
  reserverId: string;
  closeRequested: boolean;
  listing?: {
    id: string;
    title: string;
    primaryImageUrl?: string;
    imageUrl?: string; // Allow both for compatibility
  };
  reserver?: {
    id: string;
    firstName: string;
    lastName: string;
    name?: string; // Allow both for compatibility
  };
}