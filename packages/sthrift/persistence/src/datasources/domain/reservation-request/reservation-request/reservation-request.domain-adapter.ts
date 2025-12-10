import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { Domain } from '@sthrift/domain';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { ItemListingDomainAdapter } from '../../listing/item/item-listing.domain-adapter.ts';
import { PersonalUserDomainAdapter } from '../../user/personal-user/personal-user.domain-adapter.ts';
import { AdminUserDomainAdapter } from '../../user/admin-user/admin-user.domain-adapter.ts';

export class ReservationRequestConverter extends MongooseSeedwork.MongoTypeConverter<
	Models.ReservationRequest.ReservationRequest,
	ReservationRequestDomainAdapter,
	Domain.Passport,
	Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest<ReservationRequestDomainAdapter>
> {
	constructor() {
		super(
			ReservationRequestDomainAdapter,
			Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest,
		);
	}
}

export class ReservationRequestDomainAdapter
	extends MongooseSeedwork.MongooseDomainAdapter<Models.ReservationRequest.ReservationRequest>
	implements
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestProps
{
	// Primitive Fields Getters and Setters
	get state() {
		return this.doc.state;
	}

	set state(value: string) {
		this.doc.state = value;
	}

	get closeRequestedBySharer() {
		return this.doc.closeRequestedBySharer;
	}
	set closeRequestedBySharer(value: boolean) {
		this.doc.closeRequestedBySharer = value;
	}

	get closeRequestedByReserver() {
		return this.doc.closeRequestedByReserver;
	}
	set closeRequestedByReserver(value: boolean) {
		this.doc.closeRequestedByReserver = value;
	}

	get reservationPeriodStart() {
		return this.doc.reservationPeriodStart;
	}
	set reservationPeriodStart(value) {
		this.doc.reservationPeriodStart = value;
	}

	get reservationPeriodEnd() {
		return this.doc.reservationPeriodEnd;
	}
	set reservationPeriodEnd(value) {
		this.doc.reservationPeriodEnd = value;
	}

	get listing(): Domain.Contexts.Listing.ItemListing.ItemListingEntityReference {
		if (!this.doc.listing) {
			throw new Error('listing is not populated');
		}
		if (this.doc.listing instanceof MongooseSeedwork.ObjectId) {
			return {
				id: this.doc.listing.toString(),
			} as Domain.Contexts.Listing.ItemListing.ItemListingEntityReference;
		}
		return new ItemListingDomainAdapter(
			this.doc.listing as Models.Listing.ItemListing,
		);
	}

	async loadListing(): Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference> {
		if (!this.doc.listing) {
			throw new Error('listing is not populated');
		}
		if (this.doc.listing instanceof MongooseSeedwork.ObjectId) {
			await this.doc.populate('listing');
		}
		return new ItemListingDomainAdapter(
			this.doc.listing as Models.Listing.ItemListing,
		);
	}

	set listing(value: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference) {
		if (!value?.id) {
			throw new Error('listing reference is missing id');
		}
		this.doc.set('listing', new MongooseSeedwork.ObjectId(value.id));
	}

	/**
	 * Check if listing is populated (not just an ObjectId)
	 */
	get isListingPopulated(): boolean {
		return !!this.doc.listing && !(this.doc.listing instanceof MongooseSeedwork.ObjectId);
	}

	/**
	 * Get listing ID safely without requiring full population
	 */
	get listingId(): string {
		if (!this.doc.listing) {
			throw new Error('listing is not set');
		}
		if (this.doc.listing instanceof MongooseSeedwork.ObjectId) {
			return this.doc.listing.toString();
		}
		return (this.doc.listing as Models.Listing.ItemListing).id.toString();
	}

	get reserver():
		| Domain.Contexts.User.PersonalUser.PersonalUserEntityReference
		| Domain.Contexts.User.AdminUser.AdminUserEntityReference {
		if (!this.doc.reserver) {
			throw new Error('reserver is not populated');
		}
		if (this.doc.reserver instanceof MongooseSeedwork.ObjectId) {
			return {
				id: this.doc.reserver.toString(),
			} as Domain.Contexts.User.UserEntityReference;
		}
		// Check userType discriminator to determine which adapter to use
		const reserverDoc = this.doc.reserver as
			| Models.User.PersonalUser
			| Models.User.AdminUser;
		if (reserverDoc.userType === 'admin-user') {
			return new AdminUserDomainAdapter(
				this.doc.reserver as Models.User.AdminUser,
			);
		}
		const adapter = new PersonalUserDomainAdapter(
			this.doc.reserver as Models.User.PersonalUser,
		);
		return adapter.entityReference;
	}

	async loadReserver(): Promise<
		| Domain.Contexts.User.PersonalUser.PersonalUserEntityReference
		| Domain.Contexts.User.AdminUser.AdminUserEntityReference
	> {
		if (!this.doc.reserver) {
			throw new Error('reserver is not populated');
		}
		if (this.doc.reserver instanceof MongooseSeedwork.ObjectId) {
			await this.doc.populate('reserver');
		}
		// Check userType discriminator to determine which adapter to use
		const reserverDoc = this.doc.reserver as
			| Models.User.PersonalUser
			| Models.User.AdminUser;
		if (reserverDoc.userType === 'admin-user') {
			return new AdminUserDomainAdapter(
				this.doc.reserver as Models.User.AdminUser,
			);
		}
		const adapter = new PersonalUserDomainAdapter(
			this.doc.reserver as Models.User.PersonalUser,
		);
		return adapter.entityReference;
	}

	set reserver(user:
		| Domain.Contexts.User.PersonalUser.PersonalUserEntityReference
		| Domain.Contexts.User.AdminUser.AdminUserEntityReference,) {
		if (!user?.id) {
			throw new Error('user reference is missing id');
		}
		this.doc.set('reserver', new MongooseSeedwork.ObjectId(user.id));
	}
}
