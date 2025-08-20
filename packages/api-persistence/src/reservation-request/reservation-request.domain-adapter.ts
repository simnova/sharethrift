import { MongooseSeedwork } from "@cellix/data-sources-mongoose";
const { MongooseDomainAdapter, MongoTypeConverter } = MongooseSeedwork;
import { Domain } from "@sthrift/api-domain";
import type { Models } from "@sthrift/api-data-sources-mongoose-models";

/**
 * Type converter for ReservationRequest.
 * Handles conversion between Mongoose doc and domain entity.
 */
export class ReservationRequestConverter extends MongoTypeConverter<
  Models.ReservationRequest,
  ReservationRequestDomainAdapter,
  Domain.Passport,
  Domain.Contexts.ReservationRequest<ReservationRequestDomainAdapter>
> {
  constructor() {
    super(ReservationRequestDomainAdapter, Domain.Contexts.ReservationRequest);
  }
}

export class ReservationRequestDomainAdapter
  extends MongooseDomainAdapter<Models.ReservationRequest>
  implements Domain.Contexts.ReservationRequestProps
{
  // Primitive Fields Getters and Setters
  get state(): Domain.Contexts.ReservationRequestStateValue {
    return Domain.Contexts.ReservationRequestStateValue.create(this.doc.state);
  }

  set state(value: Domain.Contexts.ReservationRequestStateValue) {
    this.doc.state = value.valueOf();
  }

  get closeRequested() {
    return this.doc.closeRequested;
  }
  set closeRequested(value) {
    this.doc.closeRequested = value;
  }

  get reservationPeriod() {
    // Convert Date (Mongoose) to string (VO)
    const start = this.doc.reservationPeriodStart.toISOString();
    const end = this.doc.reservationPeriodEnd.toISOString();
    return new Domain.Contexts.ReservationPeriod({ start, end });
  }
  set reservationPeriod(value) {
    // Convert string (VO) to Date (Mongoose)
    this.doc.reservationPeriodStart = new Date(value.start.valueOf() as string);
    this.doc.reservationPeriodEnd = new Date(value.end.valueOf() as string);
  }

  get listing(): Domain.Contexts.ListingEntityReference {
    if (!this.doc.listing) {
      throw new Error("listing is not populated");
    }
    if (this.doc.listing instanceof MongooseSeedwork.ObjectId) {
      throw new Error("listing is not populated or is not of the correct type");
    }
    // Return a new Listing domain adapter. Not created yet so this cannot be returned
    return this.doc.listing as Domain.Contexts.ListingEntityReference;
  }

  async loadListing(): Promise<Domain.Contexts.ListingEntityReference> {
    if (!this.doc.listing) {
      throw new Error("listing is not populated");
    }
    if (this.doc.listing instanceof MongooseSeedwork.ObjectId) {
      await this.doc.populate("listing");
    }
    // Return a new Listing domain adapter. Not created yet so this cannot be returned
    return this.doc.listing as Domain.Contexts.ListingEntityReference;
  }

  set listing(value: Domain.Contexts.ListingEntityReference) {
    if (!value?.id) {
      throw new Error("listing reference is missing id");
    }
    this.doc.set("listing", new MongooseSeedwork.ObjectId(value.id));
  }

  get reserver(): Domain.Contexts.UserEntityReference {
    if (!this.doc.reserver) {
      throw new Error("reserver is not populated");
    }
    if (this.doc.reserver instanceof MongooseSeedwork.ObjectId) {
      throw new Error("reserver is not populated or is not of the correct type");
    }
    // Return a new User domain adapter. Not created yet so this cannot be returned
    return this.doc.reserver as Domain.Contexts.UserEntityReference;
  }

  async loadReserver(): Promise<Domain.Contexts.UserEntityReference> {
    if (!this.doc.reserver) {
      throw new Error("reserver is not populated");
    }
    if (this.doc.reserver instanceof MongooseSeedwork.ObjectId) {
      await this.doc.populate("reserver");
    }
    // Return a new User domain adapter. Not created yet so this cannot be returned
    return this.doc.reserver as Domain.Contexts.UserEntityReference;
  }

  set reserver(user: Domain.Contexts.UserEntityReference) {
    if (!user?.id) {
      throw new Error("user reference is missing id");
    }
    this.doc.set("reserver", new MongooseSeedwork.ObjectId(user.id));
  }
}
