import { MongooseSeedwork } from "@cellix/data-sources-mongoose";
import { Domain } from "@sthrift/domain";
import type { Models } from "@sthrift/data-sources-mongoose-models";
import { ItemListingDomainAdapter } from "../../listing/item/item-listing.domain-adapter.ts";
import { PersonalUserDomainAdapter } from "../../user/personal-user/personal-user.domain-adapter.ts";

export class ReservationRequestConverter extends MongooseSeedwork.MongoTypeConverter<
  Models.ReservationRequest.ReservationRequest,
  ReservationRequestDomainAdapter,
  Domain.Passport,
  Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest<ReservationRequestDomainAdapter>
> {
  constructor() {
    super(ReservationRequestDomainAdapter, Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest);
  }
}

export class ReservationRequestDomainAdapter
  extends MongooseSeedwork.MongooseDomainAdapter<Models.ReservationRequest.ReservationRequest>
  implements Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestProps
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
      throw new Error("listing is not populated");
    }
    if (this.doc.listing instanceof MongooseSeedwork.ObjectId) {
      throw new Error("listing is not populated or is not of the correct type");
    }
    return new ItemListingDomainAdapter(this.doc.listing as Models.Listing.ItemListing);
  }

  async loadListing(): Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference> {
    if (!this.doc.listing) {
      throw new Error("listing is not populated");
    }
    if (this.doc.listing instanceof MongooseSeedwork.ObjectId) {
      await this.doc.populate("listing");
    }
    return new ItemListingDomainAdapter(this.doc.listing as Models.Listing.ItemListing);
  }

  set listing(value: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference) {
    if (!value?.id) {
      throw new Error("listing reference is missing id");
    }
    this.doc.set("listing", new MongooseSeedwork.ObjectId(value.id));
  }

  get reserver(): Domain.Contexts.User.PersonalUser.PersonalUserEntityReference {
    if (!this.doc.reserver) {
      throw new Error("reserver is not populated");
    }
    if (this.doc.reserver instanceof MongooseSeedwork.ObjectId) {
      throw new Error("reserver is not populated or is not of the correct type");
    }
    return new PersonalUserDomainAdapter(this.doc.reserver as Models.User.PersonalUser);
  }

  async loadReserver(): Promise<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference> {
    if (!this.doc.reserver) {
      throw new Error("reserver is not populated");
    }
    if (this.doc.reserver instanceof MongooseSeedwork.ObjectId) {
      await this.doc.populate("reserver");
    }
    return new PersonalUserDomainAdapter(this.doc.reserver as Models.User.PersonalUser);
  }

  set reserver(user: Domain.Contexts.User.PersonalUser.PersonalUserEntityReference) {
    if (!user?.id) {
      throw new Error("user reference is missing id");
    }
    this.doc.set("reserver", new MongooseSeedwork.ObjectId(user.id));
  }
}
