// DTOs for My Listings functionality

export interface ListingAllDTO {
  id: string;
  title: string;
  image?: string;
  publishedAt: Date;
  reservationPeriod: {
    start: Date;
    end: Date;
  };
  status: ListingStatus;
  pendingRequestsCount: number;
}

export interface ListingRequestDTO {
  id: string;
  title: string;
  image?: string;
  requestedBy: string; // username
  requestedOn: Date;
  reservationPeriod: {
    start: Date;
    end: Date;
  };
  status: RequestStatus;
}

export type ListingStatus = 
  | 'Active' 
  | 'Paused' 
  | 'Reserved' 
  | 'Expired' 
  | 'Draft' 
  | 'Blocked';

export type RequestStatus = 
  | 'Accepted' 
  | 'Rejected' 
  | 'Closed' 
  | 'Pending' 
  | 'Closing';

export interface ListingAllPage {
  items: ListingAllDTO[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ListingRequestPage {
  items: ListingRequestDTO[];
  total: number;
  page: number;
  pageSize: number;
}

// Query input types
export interface MyListingsAllQueryInput {
  page: number;
  pageSize: number;
  userId: string;
  searchText?: string;
  statusFilter?: ListingStatus[];
  sortBy?: 'title' | 'publishedAt' | 'reservationPeriod' | 'pendingRequestsCount';
  sortOrder?: 'asc' | 'desc';
}

export interface MyListingsRequestsQueryInput {
  page: number;
  pageSize: number;
  userId: string;
  searchText?: string;
  statusFilter?: RequestStatus[];
  sortBy?: 'title' | 'requestedBy' | 'requestedOn' | 'reservationPeriod';
  sortOrder?: 'asc' | 'desc';
}