import type { ListingPassport } from '../../contexts/listing/listing.passport.ts';
import type { ReservationRequestPassport } from '../../contexts/reservation-request/reservation-request.passport.ts';
import type { Passport } from '../../contexts/passport.ts';
import type { UserPassport } from '../../contexts/user/user.passport.ts';
import { GuestUserPassport } from './contexts/guest.user.passport.ts';
import { GuestListingPassport } from './contexts/guest.listing.passport.ts';
import { GuestConversationPassport } from './contexts/guest.conversation.passport.ts';
import type { ConversationPassport } from '../../contexts/conversation/conversation.passport.ts';
import { GuestPassportBase } from './guest.passport-base.ts';
import { GuestReservationRequestPassport } from './contexts/guest.reservation-request.passport.ts';
import { GuestAppealRequestPassport } from './contexts/guest.appeal-request.passport.ts';
import type { AppealRequestPassport } from '../../contexts/appeal-request/appeal-request.passport.ts';

export class GuestPassport extends GuestPassportBase implements Passport {
	private _userPassport: UserPassport | undefined;
	private _listingPassport: ListingPassport | undefined;
	private _conversationPassport: ConversationPassport | undefined;
	private _reservationRequestPassport: ReservationRequestPassport | undefined;
	private _appealRequestPassport: AppealRequestPassport | undefined;

	public get user(): UserPassport {
		if (!this._userPassport) {
			this._userPassport = new GuestUserPassport();
		}
		return this._userPassport;
	}

	public get listing(): ListingPassport {
		if (!this._listingPassport) {
			this._listingPassport = new GuestListingPassport();
		}
		return this._listingPassport;
	}

	public get conversation(): ConversationPassport {
		if (!this._conversationPassport) {
			this._conversationPassport = new GuestConversationPassport();
		}
		return this._conversationPassport;
	}

	public get reservationRequest(): ReservationRequestPassport {
		if (!this._reservationRequestPassport) {
			this._reservationRequestPassport = new GuestReservationRequestPassport();
		}
		return this._reservationRequestPassport;
	}

	public get appealRequest(): AppealRequestPassport {
		if (!this._appealRequestPassport) {
			this._appealRequestPassport = new GuestAppealRequestPassport();
		}
		return this._appealRequestPassport;
	}
}
