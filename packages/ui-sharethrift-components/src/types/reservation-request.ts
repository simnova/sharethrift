// Shared ReservationRequest type stub
export type ReservationRequest = {
  id: string;
  state: 'REQUESTED' | 'ACCEPTED' | 'REJECTED' | 'RESERVATION_PERIOD' | 'CANCELLED';
  reservationPeriodStart: string;
  reservationPeriodEnd: string;
  createdAt: string;
  updatedAt: string;
  listingId: string;
  reserverId: string;
  closeRequested: boolean;
  listing: {
    id: string;
    title: string;
    imageUrl: string;
    // Add more listing fields as needed
  };
  reserver: {
    id: string;
    firstName: string;
    lastName: string;
    name?: string;
  };
};
