export interface MyListingData {
  id: string;
  title: string;
  image: string;
  publishedAt: string;
  reservationPeriod: string;
  status: string;
  pendingRequestsCount: number;
}

export interface ListingRequestData {
  id: string;
  title: string;
  image: string;
  requestedBy: string;
  requestedOn: string;
  reservationPeriod: string;
  status: string;
}