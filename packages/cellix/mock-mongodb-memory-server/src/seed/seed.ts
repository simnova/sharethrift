import type { Connection } from 'mongoose';
import { ObjectId } from 'mongodb';
import { personalUsers } from './personal-users.js';
import { itemListings } from './item-listings.js';
import { conversations } from './conversations.js';
import { reservationRequests } from './reservation-requests.js';

function toObjectId(id: string) {
	return new ObjectId(id);
}

export async function seedDatabase(connection: Connection) {
	// Insert users, referencing the default role
	const defaultRoleId = new ObjectId(); // Placeholder ID since roles are not inserted
	const usersWithRoles = personalUsers.map((u) => ({
		...u,
		_id: toObjectId(u._id),
		roles: [defaultRoleId],
	}));
	await connection.collection('personalusers').insertMany(usersWithRoles);

	// Insert listings
	const listings = itemListings.map((l) => ({
		...l,
		_id: toObjectId(l._id),
		sharer: typeof l.sharer === 'string' ? toObjectId(l.sharer) : l.sharer,
	}));
	await connection.collection('itemlistings').insertMany(listings);

	// Insert conversations
	const convs = conversations.map((c) => ({
		...c,
		_id: toObjectId(c._id),
		sharer: typeof c.sharer === 'string' ? toObjectId(c.sharer) : c.sharer,
		reserver:
			typeof c.reserver === 'string' ? toObjectId(c.reserver) : c.reserver,
		listing: typeof c.listing === 'string' ? toObjectId(c.listing) : c.listing,
	}));
	await connection.collection('conversations').insertMany(convs);

	// Insert reservation requests
	const reservations = reservationRequests.map((r) => ({
		...r,
		_id: toObjectId(r._id),
		listing: typeof r.listing === 'string' ? toObjectId(r.listing) : r.listing,
		reserver:
			typeof r.reserver === 'string' ? toObjectId(r.reserver) : r.reserver,
	}));
	await connection.collection('reservationrequests').insertMany(reservations);

	// Optionally log
	console.log('Seeded mock MongoDB memory server with initial data.');
}
