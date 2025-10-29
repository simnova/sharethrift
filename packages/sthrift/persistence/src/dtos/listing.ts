export type AdminListingDto = {
  id: string;
  title: string;
  image: string | null;
  publishedAt: string | null;
  reservationPeriod: string;
  status: string;
  pendingRequestsCount: number;
};

export type AdminPagedResult = {
  items: AdminListingDto[];
  total: number;
  page: number;
  pageSize: number;
};
