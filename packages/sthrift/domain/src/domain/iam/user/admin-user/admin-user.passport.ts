import { AdminUserPassportBase } from './admin-user.passport-base.ts';
import type { Passport } from '../../../contexts/passport.ts';
import type { UserPassport } from '../../../contexts/user/user.passport.ts';
import type { ListingPassport } from '../../../contexts/listing/listing.passport.ts';
import type { ConversationPassport } from '../../../contexts/conversation/conversation.passport.ts';
import type { ReservationRequestPassport } from '../../../contexts/reservation-request/reservation-request.passport.ts';
import type { AppealRequestPassport } from '../../../contexts/appeal-request/appeal-request.passport.ts';
import { AdminUserUserPassport } from './admin-user.user.passport.ts';
import { AdminUserListingPassport } from './contexts/admin-user.listing.passport.ts';
import { AdminUserConversationPassport } from './contexts/admin-user.conversation.passport.ts';
import { AdminUserReservationRequestPassport } from './contexts/admin-user.reservation-request.passport.ts';
import { AdminUserAppealRequestPassport } from './contexts/admin-user.appeal-request.passport.ts';

export class AdminUserPassport
	extends AdminUserPassportBase
	implements Passport
{
	private _userPassport: UserPassport | undefined;
	private _listingPassport: ListingPassport | undefined;
	private _conversationPassport: ConversationPassport | undefined;
	private _reservationRequestPassport: ReservationRequestPassport | undefined;
	private _appealRequestPassport: AppealRequestPassport | undefined;

	get user(): UserPassport {
		this._userPassport ??= new AdminUserUserPassport(this._user);
		return this._userPassport;
	}

	get listing(): ListingPassport {
		this._listingPassport ??= new AdminUserListingPassport(this._user);
		return this._listingPassport;
	}

	get conversation(): ConversationPassport {
		this._conversationPassport ??= new AdminUserConversationPassport(
			this._user,
		);
		return this._conversationPassport;
	}

	get reservationRequest(): ReservationRequestPassport {
		this._reservationRequestPassport ??=
			new AdminUserReservationRequestPassport(this._user);
		return this._reservationRequestPassport;
	}

	get appealRequest(): AppealRequestPassport {
		this._appealRequestPassport ??= new AdminUserAppealRequestPassport(
			this._user,
		);
		return this._appealRequestPassport;
	}
}
