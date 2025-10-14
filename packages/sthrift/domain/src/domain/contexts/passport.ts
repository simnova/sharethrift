import {
	GuestPassport,
	SystemPassport,
	PersonalUserPassport,
} from '../iam/index.js';
import type { PermissionsSpec } from '../iam/system/system.passport-base.js';
import type { Contexts } from '../index.js';
import type { ConversationPassport } from './conversation/conversation.passport.js';
import type { ListingPassport } from './listing/listing.passport.js';
import type { ReservationRequestPassport } from './reservation-request/reservation-request.passport.js';
import type { UserPassport } from './user/user.passport.js';

export interface Passport {
	get user(): UserPassport;
	get listing(): ListingPassport;
	get conversation(): ConversationPassport;
	get reservationRequest(): ReservationRequestPassport;
}

export const PassportFactory = {
	// for users who are not logged in on any portal - defaults to false for all permissions
	forGuest(): Passport {
		return new GuestPassport();
	},
	forSystem(permissions?: Partial<PermissionsSpec>): Passport {
		return new SystemPassport(permissions);
	},

	forPersonalUser(
		user: Contexts.User.PersonalUser.PersonalUserEntityReference,
	): Passport {
		return new PersonalUserPassport(user);
	},
};
