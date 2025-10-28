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
import type { AccountPlanPassport } from '../../contexts/account-plan/index.ts';
import { GuestAccountPlanPassport } from './contexts/guest.account-plan.passport.ts';
export class GuestPassport extends GuestPassportBase implements Passport {
	private _userPassport: UserPassport | undefined;
	private _listingPassport: ListingPassport | undefined;
	private _conversationPassport: ConversationPassport | undefined;
	private _reservationRequestPassport: ReservationRequestPassport | undefined;
	private _accountPlanPassport: AccountPlanPassport | undefined;

	public get user(): UserPassport {
		this._userPassport ??= new GuestUserPassport();
		return this._userPassport;
	}

	public get listing(): ListingPassport {
		this._listingPassport ??= new GuestListingPassport();
		return this._listingPassport;
	}

	public get conversation(): ConversationPassport {
		this._conversationPassport ??= new GuestConversationPassport();
		return this._conversationPassport;
	}

	public get reservationRequest(): ReservationRequestPassport {
		this._reservationRequestPassport ??= new GuestReservationRequestPassport();
		return this._reservationRequestPassport;
	}

	public get accountPlan(): AccountPlanPassport {
		this._accountPlanPassport ??= new GuestAccountPlanPassport();
		return this._accountPlanPassport;
	}
}
