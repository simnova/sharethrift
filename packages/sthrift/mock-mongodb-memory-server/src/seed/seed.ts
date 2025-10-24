import type { Connection } from 'mongoose';
import { ObjectId } from 'mongodb';
import { personalUsers } from './personal-users.js';
import { itemListings } from './item-listings.js';
import { conversations } from './conversations.js';
import { reservationRequests } from './reservation-requests.js';
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

	console.log('Seeded mock MongoDB memory server with initial data.');
}
