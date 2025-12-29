export interface MyListingData {
  id: string;
  title: string;
  image?: string | null;
  createdAt?: string | null;
  reservationPeriod?: string | null;
  status: string;
  pendingRequestsCount: number;
}

export interface ListingRequestData {
  id: string;
  title: string;
  image?: string | null;
  requestedBy: string;
  requestedById?: string | null;
  requestedOn: string;
  reservationPeriod: string;
  status: string;
}