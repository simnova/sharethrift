
export interface TransactionalEmailService {
	sendReservationNotification(
		recipientEmail: string,
		reserverName: string,
		listingTitle: string,
		reservationStart: string,
		reservationEnd: string,
	): Promise<void>;
}
