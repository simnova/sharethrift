import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { ItemListingEntityReference } from '../../listing/item/item-listing.entity.ts';
import type { UserEntityReference } from '../../user/index.ts';
import type { MessageEntityReference } from './message.entity.ts';
import type { ReservationRequestEntityReference } from '../../reservation-request/reservation-request/reservation-request.entity.ts';

export interface ConversationProps extends DomainSeedwork.DomainEntityProps {
	sharer: Readonly<UserEntityReference>;
	loadSharer: () => Promise<Readonly<UserEntityReference>>;
	reserver: Readonly<UserEntityReference>;
	loadReserver: () => Promise<Readonly<UserEntityReference>>;
	listing: Readonly<ItemListingEntityReference>;
	loadListing: () => Promise<Readonly<ItemListingEntityReference>>;
	reservationRequest?: Readonly<ReservationRequestEntityReference> | undefined;
	loadReservationRequest?: () => Promise<
		Readonly<ReservationRequestEntityReference> | undefined
	>;
	messagingConversationId: string;
	messages: Readonly<MessageEntityReference[]>;
	loadMessages: () => Promise<Readonly<MessageEntityReference[]>>;
	expiresAt?: Date | undefined;

	get createdAt(): Date;
	get updatedAt(): Date;
	get schemaVersion(): string;
}

export interface ConversationEntityReference
	extends Readonly<
		Omit<
			ConversationProps,
			'sharer' | 'reserver' | 'listing' | 'reservationRequest'
		>
	> {
	readonly sharer: UserEntityReference;
	readonly reserver: UserEntityReference;
	readonly listing: ItemListingEntityReference;
	readonly reservationRequest?: ReservationRequestEntityReference | undefined;
	readonly expiresAt?: Date | undefined;
}
