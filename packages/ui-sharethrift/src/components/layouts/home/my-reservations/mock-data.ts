// Mock data for reservations
export interface MockReservation {
  id: string;
  listing: {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
  };
  reserver: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'closing' | 'closed';
  reservationPeriodStart: string;
  reservationPeriodEnd: string;
  requestedOn: string;
}

export const mockReservations: MockReservation[] = [
  {
    id: '1',
    listing: {
      id: 'listing-1',
      title: 'Mountain Bike - Trek X-Caliber 8',
      description: 'Perfect for trails and city riding',
      imageUrl: 'https://images.unsplash.com/photo-1544191696-15107d1377db?w=400&h=300&fit=crop',
    },
    reserver: {
      id: 'user-1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    },
    status: 'pending',
    reservationPeriodStart: '2024-03-15T00:00:00Z',
    reservationPeriodEnd: '2024-03-20T00:00:00Z',
    requestedOn: '2024-03-10T10:30:00Z',
  },
  {
    id: '2',
    listing: {
      id: 'listing-2',
      title: 'Camping Tent - 4 Person',
      description: 'Spacious family tent for outdoor adventures',
      imageUrl: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400&h=300&fit=crop',
    },
    reserver: {
      id: 'user-2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
    },
    status: 'accepted',
    reservationPeriodStart: '2024-03-22T00:00:00Z',
    reservationPeriodEnd: '2024-03-25T00:00:00Z',
    requestedOn: '2024-03-18T14:15:00Z',
  },
  {
    id: '3',
    listing: {
      id: 'listing-3',
      title: 'AirPods Pro - 2nd Generation',
      description: 'Noise-cancelling wireless earbuds',
      imageUrl: 'https://images.unsplash.com/photo-1606220838315-056192d5e927?w=400&h=300&fit=crop',
    },
    reserver: {
      id: 'user-3',
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike.j@example.com',
    },
    status: 'rejected',
    reservationPeriodStart: '2024-03-12T00:00:00Z',
    reservationPeriodEnd: '2024-03-14T00:00:00Z',
    requestedOn: '2024-03-08T09:45:00Z',
  },
  {
    id: '4',
    listing: {
      id: 'listing-4',
      title: 'Projector - 4K Mini Portable',
      description: 'Compact projector for presentations and entertainment',
      imageUrl: 'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=400&h=300&fit=crop',
    },
    reserver: {
      id: 'user-4',
      firstName: 'Sarah',
      lastName: 'Williams',
      email: 'sarah.w@example.com',
    },
    status: 'closing',
    reservationPeriodStart: '2024-03-18T00:00:00Z',
    reservationPeriodEnd: '2024-03-21T00:00:00Z',
    requestedOn: '2024-03-15T16:20:00Z',
  },
  {
    id: '5',
    listing: {
      id: 'listing-5',
      title: 'Gaming Chair - Ergonomic Design',
      description: 'Comfortable chair for long gaming sessions',
      imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    },
    reserver: {
      id: 'user-5',
      firstName: 'Alex',
      lastName: 'Brown',
      email: 'alex.brown@example.com',
    },
    status: 'closed',
    reservationPeriodStart: '2024-02-28T00:00:00Z',
    reservationPeriodEnd: '2024-03-05T00:00:00Z',
    requestedOn: '2024-02-25T11:30:00Z',
  },
  {
    id: '6',
    listing: {
      id: 'listing-6',
      title: 'DSLR Camera - Canon EOS 90D',
      description: 'Professional camera for photography enthusiasts',
      imageUrl: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
    },
    reserver: {
      id: 'user-6',
      firstName: 'Emma',
      lastName: 'Davis',
      email: 'emma.davis@example.com',
    },
    status: 'cancelled',
    reservationPeriodStart: '2024-03-25T00:00:00Z',
    reservationPeriodEnd: '2024-03-30T00:00:00Z',
    requestedOn: '2024-03-20T13:10:00Z',
  },
];

export const getActiveReservations = () => {
  return mockReservations.filter(r => 
    ['pending', 'accepted', 'rejected', 'cancelled', 'closing'].includes(r.status)
  );
};

export const getReservationHistory = () => {
  return mockReservations.filter(r => r.status === 'closed');
};