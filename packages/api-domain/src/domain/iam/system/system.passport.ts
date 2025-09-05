import type { Passport } from '../../contexts/passport.ts';
import type { UserPassport } from '../../contexts/user/user.passport.ts';
import type { ListingPassport } from '../../contexts/listing/listing.passport.ts';
import type { ConversationPassport } from '../../contexts/conversation/conversation.passport.ts';
import { SystemUserPassport } from './contexts/system.user.passport.ts';
import { SystemListingPassport } from './contexts/system.item-listing.passport.ts';
import { SystemConversationPassport } from './contexts/system.conversation.passport.ts'; // Ensure this file exists and is named correctly
import { SystemPassportBase } from './system.passport-base.ts';

export class SystemPassport extends SystemPassportBase implements Passport {
	private _userPassport: UserPassport | undefined;
	private _listingPassport: ListingPassport | undefined;
	private _conversationPassport: ConversationPassport | undefined;

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
}
