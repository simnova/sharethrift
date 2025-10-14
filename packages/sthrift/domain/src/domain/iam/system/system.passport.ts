import type { Passport } from '../../contexts/passport.js';
import type { UserPassport } from '../../contexts/user/user.passport.js';
import type { ListingPassport } from '../../contexts/listing/listing.passport.js';
import type { ConversationPassport } from '../../contexts/conversation/conversation.passport.js';
import type { ReservationRequestPassport } from '../../contexts/reservation-request/reservation-request.passport.js';
import { SystemUserPassport } from './contexts/system.user.passport.js';
import { SystemListingPassport } from './contexts/system.listing.passport.js';
import { SystemConversationPassport } from './contexts/system.conversation.passport.js'; // Ensure this file exists and is named correctly
import { SystemReservationRequestPassport } from './contexts/system.reservation-request.js';
import { SystemPassportBase } from './system.passport-base.js';

export class SystemPassport extends SystemPassportBase implements Passport {
	private _userPassport: UserPassport | undefined;
	private _listingPassport: ListingPassport | undefined;
	private _conversationPassport: ConversationPassport | undefined;
    private _reservationRequestPassport: ReservationRequestPassport | undefined;

	public get user(): UserPassport {
		if (!this._userPassport) {
			this._userPassport = new SystemUserPassport(this.permissions);
		}
		return this._userPassport;
	}

	public get listing(): ListingPassport {
		if (!this._listingPassport) {
			this._listingPassport = new SystemListingPassport(this.permissions);
		}
		return this._listingPassport;
	}

	public get conversation(): ConversationPassport {
		if (!this._conversationPassport) {
			this._conversationPassport = new SystemConversationPassport(
				this.permissions,
			);
		}
		return this._conversationPassport;
	}

    public get reservationRequest(): ReservationRequestPassport {
		if (!this._reservationRequestPassport) {
			this._reservationRequestPassport = new SystemReservationRequestPassport(this.permissions);
		}
		return this._reservationRequestPassport;
	}
}
