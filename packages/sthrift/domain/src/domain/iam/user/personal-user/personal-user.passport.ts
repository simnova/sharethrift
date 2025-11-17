import type { ConversationPassport } from '../../../contexts/conversation/conversation.passport.ts';
import type { ListingPassport } from '../../../contexts/listing/listing.passport.ts';
import type { Passport } from '../../../contexts/passport.ts';
import type { ReservationRequestPassport } from '../../../contexts/reservation-request/reservation-request.passport.ts';
import type { AppealRequestPassport } from '../../../contexts/appeal-request/appeal-request.passport.ts';
import type { UserPassport } from '../../../contexts/user/user.passport.ts';
import { PersonalUserUserPassport } from './contexts/personal-user.user.passport.ts';
import { PersonalUserListingPassport } from './contexts/personal-user.listing.passport.ts';
import { PersonalUserConversationPassport } from './contexts/personal-user.conversation.passport.ts';
import { PersonalUserReservationRequestPassport } from './contexts/personal-user.reservation-request.passport.ts';
import { PersonalUserAppealRequestPassport } from './contexts/personal-user.appeal-request.passport.ts';
import { PersonalUserPassportBase } from './personal-user.passport-base.ts';
export class PersonalUserPassport
	extends PersonalUserPassportBase
	implements Passport
{
	private _userPassport: UserPassport | undefined;
	private _listingPassport: ListingPassport | undefined;
	private _conversationPassport: ConversationPassport | undefined;
	private _reservationRequestPassport: ReservationRequestPassport | undefined;
	private _appealRequestPassport: AppealRequestPassport | undefined;

	get user(): UserPassport {
		this._userPassport ??= new PersonalUserUserPassport(this._user);
		return this._userPassport;
	}
	get listing(): ListingPassport {
		this._listingPassport ??= new PersonalUserListingPassport(this._user);
		return this._listingPassport;
	}

	get conversation(): ConversationPassport {
		this._conversationPassport ??= new PersonalUserConversationPassport(
			this._user,
		);
		return this._conversationPassport;
	}
	get reservationRequest(): ReservationRequestPassport {
		this._reservationRequestPassport ??=
			new PersonalUserReservationRequestPassport(this._user);
		return this._reservationRequestPassport;
	}
	get appealRequest(): AppealRequestPassport {
		this._appealRequestPassport ??= new PersonalUserAppealRequestPassport(
			this._user,
		);
		return this._appealRequestPassport;
	}
}
