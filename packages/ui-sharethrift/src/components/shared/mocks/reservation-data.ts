export interface MockReservationRequest {
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
    title?: string;
    imageUrl?: string;
  };
  reserver?: {
    id: string;
    name?: string;
  };
}

export const mockReservationRequests: MockReservationRequest[] = [
  {
    id: '1',
    state: 'REQUESTED',
    reservationPeriodStart: '2024-02-15T00:00:00Z',
    reservationPeriodEnd: '2024-02-22T00:00:00Z',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    listingId: 'listing-1',
    reserverId: 'user-1',
    closeRequested: false,
    listing: {
      id: 'listing-1',
      title: 'Professional Camera Kit',
      imageUrl: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=200&fit=crop'
    },
    reserver: {
      id: 'user-1',
      name: 'John Smith'
    }
  },
  {
    id: '2',
    state: 'ACCEPTED',
    reservationPeriodStart: '2024-02-01T00:00:00Z',
    reservationPeriodEnd: '2024-02-08T00:00:00Z',
    createdAt: '2024-01-10T14:15:00Z',
    updatedAt: '2024-01-12T09:20:00Z',
    listingId: 'listing-2',
    reserverId: 'user-2',
    closeRequested: false,
    listing: {
      id: 'listing-2',
      title: 'Power Drill Set',
      imageUrl: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=300&h=200&fit=crop'
    },
    reserver: {
      id: 'user-2',
      name: 'Sarah Johnson'
    }
  },
  {
    id: '3',
    state: 'REJECTED',
    reservationPeriodStart: '2024-01-20T00:00:00Z',
    reservationPeriodEnd: '2024-01-25T00:00:00Z',
    createdAt: '2024-01-05T11:45:00Z',
    updatedAt: '2024-01-08T16:30:00Z',
    listingId: 'listing-3',
    reserverId: 'user-3',
    closeRequested: false,
    listing: {
      id: 'listing-3',
      title: 'Camping Tent (4-person)',
      imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=300&h=200&fit=crop'
    },
    reserver: {
      id: 'user-3',
      name: 'Mike Davis'
    }
  },
  {
    id: '4',
    state: 'CANCELLED',
    reservationPeriodStart: '2024-01-15T00:00:00Z',
    reservationPeriodEnd: '2024-01-18T00:00:00Z',
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-03T12:15:00Z',
    listingId: 'listing-4',
    reserverId: 'user-4',
    closeRequested: false,
    listing: {
      id: 'listing-4',
      title: 'Bicycle Pump & Repair Kit',
      imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop'
    },
    reserver: {
      id: 'user-4',
      name: 'Emily Wilson'
    }
  },
  {
    id: '5',
    state: 'RESERVATION_PERIOD',
    reservationPeriodStart: '2023-12-10T00:00:00Z',
    reservationPeriodEnd: '2023-12-17T00:00:00Z',
    createdAt: '2023-12-01T15:20:00Z',
    updatedAt: '2023-12-20T10:30:00Z',
    listingId: 'listing-5',
    reserverId: 'user-5',
    closeRequested: false,
    listing: {
      id: 'listing-5',
      title: 'Kitchen Stand Mixer',
      imageUrl: 'https://images.unsplash.com/photo-1585515656642-b5b725e2bb42?w=300&h=200&fit=crop'
    },
    reserver: {
      id: 'user-5',
      name: 'David Brown'
    }
  },
  {
    id: '6',
    state: 'RESERVATION_PERIOD',
    reservationPeriodStart: '2023-11-15T00:00:00Z',
    reservationPeriodEnd: '2023-11-20T00:00:00Z',
    createdAt: '2023-11-05T13:45:00Z',
    updatedAt: '2023-11-25T14:20:00Z',
    listingId: 'listing-6',
    reserverId: 'user-6',
    closeRequested: false,
    listing: {
      id: 'listing-6',
      title: 'Gaming Console with Controllers',
      imageUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&h=200&fit=crop'
    },
    reserver: {
      id: 'user-6',
      name: 'Lisa Garcia'
    }
  }
];

export const getActiveReservations = (): MockReservationRequest[] => {
  return mockReservationRequests.filter(r => 
    ['REQUESTED', 'ACCEPTED', 'REJECTED', 'CANCELLED'].includes(r.state)
  );
};

export const getHistoryReservations = (): MockReservationRequest[] => {
  return mockReservationRequests.filter(r => 
    r.state === 'RESERVATION_PERIOD'
  );
};