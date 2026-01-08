import type { AccountPlanPassport } from '../../contexts/account-plan/account-plan.passport.ts';
import type { AppealRequestPassport } from '../../contexts/appeal-request/appeal-request.passport.ts';
import type { ConversationPassport } from '../../contexts/conversation/conversation.passport.ts';
import type { ListingPassport } from '../../contexts/listing/listing.passport.ts';
import type { Passport } from '../../contexts/passport.ts';
import type { ReservationRequestPassport } from '../../contexts/reservation-request/reservation-request.passport.ts';
import type { UserPassport } from '../../contexts/user/user.passport.ts';
import { SystemAccountPlanPassport } from './contexts/system.account-plan.passport.ts';
import { SystemAppealRequestPassport } from './contexts/system.appeal-request.passport.ts';
import { SystemConversationPassport } from './contexts/system.conversation.passport.ts'; // Ensure this file exists and is named correctly
import { SystemListingPassport } from './contexts/system.listing.passport.ts';
import { SystemReservationRequestPassport } from './contexts/system.reservation-request.ts';
import { SystemUserPassport } from './contexts/system.user.passport.ts';
import { SystemPassportBase } from './system.passport-base.ts';

export class SystemPassport extends SystemPassportBase implements Passport {
	private _userPassport: UserPassport | undefined;
	private _listingPassport: ListingPassport | undefined;
	private _conversationPassport: ConversationPassport | undefined;
	private _reservationRequestPassport: ReservationRequestPassport | undefined;
	private _accountPlanPassport: AccountPlanPassport | undefined;
	private _appealRequestPassport: AppealRequestPassport | undefined;

	public get user(): UserPassport {
		this._userPassport ??= new SystemUserPassport(this.permissions);
		return this._userPassport;
	}

	public get listing(): ListingPassport {
		this._listingPassport ??= new SystemListingPassport(this.permissions);
		return this._listingPassport;
	}

	public get conversation(): ConversationPassport {
		this._conversationPassport ??= new SystemConversationPassport(
			this.permissions,
		);
		return this._conversationPassport;
	}

	public get reservationRequest(): ReservationRequestPassport {
		if (!this._reservationRequestPassport) {
			this._reservationRequestPassport = new SystemReservationRequestPassport(
				this.permissions,
			);
		}
		return this._reservationRequestPassport;
	}

	public get accountPlan(): AccountPlanPassport {
		this._accountPlanPassport ??= new SystemAccountPlanPassport(
			this.permissions,
		);
		return this._accountPlanPassport;
	}

	public get appealRequest(): AppealRequestPassport {
		if (!this._appealRequestPassport) {
			this._appealRequestPassport = new SystemAppealRequestPassport(
				this.permissions,
			);
		}
		return this._appealRequestPassport;
	}
}
