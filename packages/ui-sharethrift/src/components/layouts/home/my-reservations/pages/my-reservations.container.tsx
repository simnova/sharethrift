import MyReservationsMain from './my-reservations';


//Will eventually come from the generated graphql files
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
  listing: {
    id: string;
    title: string;
    imageUrl: string;
  };
  reserver: {
    id: string;
    firstName: string;
    lastName: string;
    name?: string;
  };
}


export interface MyReservationsContainerProps {
  userId: string;
}

export const MyReservationsContainer: React.FC<MyReservationsContainerProps> = ({ userId }) => {
  return <MyReservationsMain userId={userId} />;
};