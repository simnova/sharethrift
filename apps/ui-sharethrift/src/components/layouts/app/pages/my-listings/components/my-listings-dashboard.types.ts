export interface ListingRequestData {
  id: string;
  title: string;
  image?: string | null;
  requestedBy: string;
  requestedOn: string;
  reservationPeriod: string;
  status: string;
}
