import { Domain } from '@sthrift/domain';
import type { DataSourcesFactory } from '@sthrift/persistence';
import type { SendGrid } from '@sthrift/service-sendgrid';
import { NodeEventBusInstance } from '@cellix/event-bus-seedwork-node';

export const ReservationRequestCreatedNotifySharerHandler = (
dataSourcesFactory: DataSourcesFactory,
_sendGridService: SendGrid,
) => {
return async (payload: {
reservationRequestId: string;
listingId: string;
reserverId: string;
sharerId: string;
reservationPeriodStart: Date;
reservationPeriodEnd: Date;
}) => {
try {
console.log(
'ReservationRequestCreatedNotifySharerHandler: Processing event for reservation request',
payload.reservationRequestId,
);

// Get the datasources with system passport to fetch user information
const { readonlyDataSource } = dataSourcesFactory.withSystemPassport();

// Fetch the sharer (listing owner) details
const sharer = await readonlyDataSource.User.PersonalUser.PersonalUserReadRepo.getById(
payload.sharerId,
);

if (!sharer) {
console.error(
`Sharer with ID ${payload.sharerId} not found for reservation request ${payload.reservationRequestId}`,
);
return;
}

// Fetch the reserver details
const reserver =
await readonlyDataSource.User.PersonalUser.PersonalUserReadRepo.getById(
payload.reserverId,
);

if (!reserver) {
console.error(
`Reserver with ID ${payload.reserverId} not found for reservation request ${payload.reservationRequestId}`,
);
return;
}

// Fetch the listing details
const listing =
await readonlyDataSource.Listing.ItemListing.ItemListingReadRepo.getById(
payload.listingId,
);

if (!listing) {
console.error(
`Listing with ID ${payload.listingId} not found for reservation request ${payload.reservationRequestId}`,
);
return;
}

// Prepare email notification data
const sharerEmail = sharer.account.email;
const reserverName = reserver.account.username || reserver.account.email;
const listingTitle = listing.title;
const reservationStart = payload.reservationPeriodStart.toLocaleDateString();
const reservationEnd = payload.reservationPeriodEnd.toLocaleDateString();

console.log(
`Sending reservation notification email to ${sharerEmail} for listing "${listingTitle}"`,
);

// TODO: Create a proper sendReservationNotification method in SendGrid service
// For now, we'll log that the email would be sent
console.log('Email would be sent with the following details:');
console.log(`  To: ${sharerEmail}`);
console.log(`  Reserver: ${reserverName}`);
console.log(`  Listing: ${listingTitle}`);
console.log(`  Period: ${reservationStart} - ${reservationEnd}`);

// Actual email sending would look like:
// await sendGridService.sendReservationNotification(
//   sharerEmail,
//   reserverName,
//   listingTitle,
//   reservationStart,
//   reservationEnd
// );
} catch (error) {
console.error(
'Error in ReservationRequestCreatedNotifySharerHandler:',
error,
);
// Don't throw - integration events should not affect the main transaction
}
};
};

export const registerReservationRequestCreatedHandler = (
	dataSourcesFactory: DataSourcesFactory,
	sendGridService: SendGrid,
) => {
	NodeEventBusInstance.register(
		Domain.ReservationRequestCreatedEvent,
		ReservationRequestCreatedNotifySharerHandler(
			dataSourcesFactory,
			sendGridService,
		),
	);
};
