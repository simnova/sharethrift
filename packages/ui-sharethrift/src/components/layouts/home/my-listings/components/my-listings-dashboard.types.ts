export interface MyListingData {
  id: string;
  title: string;
  image?: string | null;
  publishedAt?: string | null;
  reservationPeriod?: string | null;
  status: string;
  pendingRequestsCount: number;
}

export interface ListingRequestData {
  id: string;
  title: string;
  image?: string | null;
  requestedBy: string;
  requestedOn: string;
  reservationPeriod: string;
  status: string;
}