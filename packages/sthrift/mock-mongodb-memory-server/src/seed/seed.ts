import type { Connection } from 'mongoose';
import { ObjectId } from 'mongodb';
import { personalUsers } from './personal-users.js';
import { itemListings } from './item-listings.js';
import { conversations } from './conversations.js';
import { reservationRequests } from './reservation-requests.js';
import { accountPlans } from './account-plan.js';
import { listingAppealRequests } from './listing-appeal-requests.js';
import { userAppealRequests } from './user-appeal-requests.js';
import type { Models } from '@sthrift/data-sources-mongoose-models';

function toObjectId(id: string) {
	return new ObjectId(id);
}

export async function seedDatabase(connection: Connection) {
	const defaultRoleId = new ObjectId(); // Placeholder ID since roles are not inserted
	const usersWithRoles = personalUsers.map((u: Models.User.PersonalUser) => ({
		...u,
		_id: toObjectId(u._id as string),
		roles: [defaultRoleId],
	}));
	await connection.collection('users').insertMany(usersWithRoles);

	const listings = itemListings.map((l: Models.Listing.ItemListing) => ({
		...l,
		_id: toObjectId(l._id as string),
		sharer: l.sharer as ObjectId,
	}));
	await connection.collection('listings').insertMany(listings);

	const convs = conversations.map((c: Models.Conversation.Conversation) => ({
		...c,
		_id: toObjectId(c._id as string),
		sharer: c.sharer as ObjectId,
		reserver: c.reserver as ObjectId,
		listing: c.listing as ObjectId,
	}));
	await connection.collection('conversations').insertMany(convs);

	const reservations = reservationRequests.map(
		(r: Models.ReservationRequest.ReservationRequest) => ({
			...r,
			_id: toObjectId(r._id as string),
			listing: r.listing as ObjectId,
			reserver: r.reserver as ObjectId,
		}),
	);
	await connection.collection('reservationRequests').insertMany(reservations);

	const accPlan = accountPlans.map((p: Models.AccountPlan.AccountPlan) => ({
		...p,
		_id: toObjectId(p._id as string),
	}));
	await connection.collection('accountplans').insertMany(accPlan);

	const listingAppeals = listingAppealRequests.map(
		(a: Models.AppealRequest.ListingAppealRequest) => ({
			...a,
			_id: toObjectId(a._id as string),
			user: a.user as ObjectId,
			blocker: a.blocker as ObjectId,
			listing: a.listing as ObjectId,
		}),
	);
	await connection.collection('appealRequests').insertMany(listingAppeals);

	const userAppeals = userAppealRequests.map(
		(a: Models.AppealRequest.UserAppealRequest) => ({
			...a,
			_id: toObjectId(a._id as string),
			user: a.user as ObjectId,
			blocker: a.blocker as ObjectId,
		}),
	);
	await connection.collection('appealRequests').insertMany(userAppeals);

	console.log('Seeded mock MongoDB memory server with initial data.');
}
