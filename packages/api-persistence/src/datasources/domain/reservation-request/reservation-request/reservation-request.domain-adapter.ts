import { MongooseSeedwork } from "@cellix/data-sources-mongoose";
import { Domain } from "@sthrift/api-domain";
import type { Models } from "@sthrift/api-data-sources-mongoose-models";

/**
 * Type converter for ReservationRequest.
 * Handles conversion between Mongoose doc and domain entity.
 */
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

  get closeRequested() {
    return this.doc.closeRequested;
  }
  set closeRequested(value) {
    this.doc.closeRequested = value;
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

  get listing(): Domain.Contexts.ReservationRequest.ReservationRequest.ListingEntityReference {
    if (!this.doc.listing) {
      throw new Error("listing is not populated");
    }
    if (this.doc.listing instanceof MongooseSeedwork.ObjectId) {
      throw new Error("listing is not populated or is not of the correct type");
    }
    // Return a new Listing domain adapter. Not created yet so this cannot be returned
    return this.doc.listing as Domain.Contexts.ReservationRequest.ReservationRequest.ListingEntityReference;
  }

  async loadListing(): Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ListingEntityReference> {
    if (!this.doc.listing) {
      throw new Error("listing is not populated");
    }
    if (this.doc.listing instanceof MongooseSeedwork.ObjectId) {
      await this.doc.populate("listing");
    }
    // Return a new Listing domain adapter. Not created yet so this cannot be returned
    return this.doc.listing as Domain.Contexts.ReservationRequest.ReservationRequest.ListingEntityReference;
  }

  set listing(value: Domain.Contexts.ReservationRequest.ReservationRequest.ListingEntityReference) {
    if (!value?.id) {
      throw new Error("listing reference is missing id");
    }
    this.doc.set("listing", new MongooseSeedwork.ObjectId(value.id));
  }

  get reserver(): Domain.Contexts.ReservationRequest.ReservationRequest.UserEntityReference {
    if (!this.doc.reserver) {
      throw new Error("reserver is not populated");
    }
    if (this.doc.reserver instanceof MongooseSeedwork.ObjectId) {
      throw new Error("reserver is not populated or is not of the correct type");
    }
    // Return a new User domain adapter. Not created yet so this cannot be returned
    return this.doc.reserver as Domain.Contexts.ReservationRequest.ReservationRequest.UserEntityReference;
  }

  async loadReserver(): Promise<Domain.Contexts.ReservationRequest.ReservationRequest.UserEntityReference> {
    if (!this.doc.reserver) {
      throw new Error("reserver is not populated");
    }
    if (this.doc.reserver instanceof MongooseSeedwork.ObjectId) {
      await this.doc.populate("reserver");
    }
    // Return a new User domain adapter. Not created yet so this cannot be returned
    return this.doc.reserver as Domain.Contexts.ReservationRequest.ReservationRequest.UserEntityReference;
  }

  set reserver(user: Domain.Contexts.ReservationRequest.ReservationRequest.UserEntityReference) {
    if (!user?.id) {
      throw new Error("user reference is missing id");
    }
    this.doc.set("reserver", new MongooseSeedwork.ObjectId(user.id));
  }
}
