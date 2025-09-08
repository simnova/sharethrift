import type { ConversationPassport } from './conversation/conversation.passport.ts';
import type { UserPassport } from './user/user.passport.ts';
import type { ListingPassport } from './listing/listing.passport.ts';
import { SystemPassport, GuestPassport } from '../iam/index.ts';
import type { PermissionsSpec } from '../iam/system/system.passport-base.ts';
import type { ReservationRequestPassport } from './reservation-request/reservation-request.passport.ts';


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
};
