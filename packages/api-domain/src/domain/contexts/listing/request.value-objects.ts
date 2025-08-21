import { VOString } from '@lucaspaganini/value-objects';

/**
 * Enumeration of possible listing request states
 */
export const ListingRequestStateEnum = {
	Pending: 'Pending',
	Accepted: 'Accepted',
	Rejected: 'Rejected',
	Cancelled: 'Cancelled',
	Closed: 'Closed',
	Closing: 'Closing',
} as const;

export class ListingRequestState extends VOString({
	trim: true,
	minLength: 1,
	maxLength: 20,
}) {
	static Pending = new ListingRequestState(ListingRequestStateEnum.Pending);
	static Accepted = new ListingRequestState(ListingRequestStateEnum.Accepted);
	static Rejected = new ListingRequestState(ListingRequestStateEnum.Rejected);
	static Cancelled = new ListingRequestState(ListingRequestStateEnum.Cancelled);
	static Closed = new ListingRequestState(ListingRequestStateEnum.Closed);
	static Closing = new ListingRequestState(ListingRequestStateEnum.Closing);

	get isPending(): boolean {
		return this.valueOf() === ListingRequestStateEnum.Pending;
	}

	get isAccepted(): boolean {
		return this.valueOf() === ListingRequestStateEnum.Accepted;
	}

	get isRejected(): boolean {
		return this.valueOf() === ListingRequestStateEnum.Rejected;
	}

	get isCancelled(): boolean {
		return this.valueOf() === ListingRequestStateEnum.Cancelled;
	}

	get isClosed(): boolean {
		return this.valueOf() === ListingRequestStateEnum.Closed;
	}

	get isClosing(): boolean {
		return this.valueOf() === ListingRequestStateEnum.Closing;
	}
}