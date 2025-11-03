import type { ListingPassport } from '../../../contexts/listing/listing.passport.ts';
import type { Passport } from '../../../contexts/passport.ts';
import type { ReservationRequestPassport } from '../../../contexts/reservation-request/reservation-request.passport.ts';
import type { UserPassport } from '../../../contexts/user/user.passport.ts';
import { PersonalUserListingPassport } from './contexts/personal-user.listing.passport.ts';
import { PersonalUserReservationRequestPassport } from './contexts/personal-user.reservation-request.passport.ts';
import { PersonalUserUserPassport } from './contexts/personal-user.user.passport.ts';
import { PersonalUserPassportBase } from './personal-user.passport-base.ts';
export class PersonalUserPassport
	extends PersonalUserPassportBase
	implements Passport
{
	private _userPassport: UserPassport | undefined;
	private _listingPassport: ListingPassport | undefined;
	private _reservationRequestPassport: ReservationRequestPassport | undefined;

	get user(): UserPassport {
		this._userPassport ??= new PersonalUserUserPassport(this._user);
		return this._userPassport;
	}
	// Implement other properties as needed
	get listing(): ListingPassport {
		this._listingPassport ??= new PersonalUserListingPassport(this._user);
		return this._listingPassport;
	}
	get conversation(): never {
		throw new Error('Method not implemented.');
	}
	get reservationRequest(): ReservationRequestPassport {
		this._reservationRequestPassport ??=
			new PersonalUserReservationRequestPassport(this._user);
		return this._reservationRequestPassport;
	}
}
