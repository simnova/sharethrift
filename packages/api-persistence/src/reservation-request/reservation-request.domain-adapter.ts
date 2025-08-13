import { MongooseSeedwork } from "@cellix/data-sources-mongoose";
const { MongooseDomainAdapter, MongoTypeConverter } = MongooseSeedwork;
import type { ReservationRequestProps, Passport } from "@ocom/api-domain";
import { Domain, ReservationRequest as ReservationRequestAggregate } from "@ocom/api-domain";
import { Models } from "@ocom/api-data-sources-mongoose-models";

/**
 * Type converter for ReservationRequest.
 * Handles conversion between Mongoose doc and domain entity.
 */
export class ReservationRequestConverter extends MongoTypeConverter<
  Models.ReservationRequest,
  ReservationRequestDomainAdapter,
  Passport,
  Domain.Contexts.ReservationRequest<ReservationRequestDomainAdapter>
> {
  constructor() {
    super(ReservationRequestDomainAdapter, ReservationRequestAggregate);
  }
}

export class ReservationRequestDomainAdapter extends MongooseDomainAdapter<Models.ReservationRequest> implements ReservationRequestProps {
  // Primitive Fields Getters and Setters
  get state(): Domain.Contexts.ReservationRequestStateValue {
    return Domain.Contexts.ReservationRequestStateValue.create(this.doc.state);
  }

  set state(value: Domain.Contexts.ReservationRequestStateValue) {
    this.doc.state = value.valueOf();
  }

  get listingId() {
    return this.doc.listing?.toString() || "";
  }
  set listingId(value: string) {
    this.doc.listing = value;
  }

  get reserverId() {
    return this.doc.reserver?.toString() || "";
  }
  set reserverId(value: string) {
    this.doc.reserver = value;
  }

  get reservationPeriod() {
    // Convert Date (Mongoose) to string (VO)
    const start = this.doc.reservationPeriodStart instanceof Date ? this.doc.reservationPeriodStart.toISOString() : null;
    const end = this.doc.reservationPeriodEnd instanceof Date ? this.doc.reservationPeriodEnd.toISOString() : null;
    return new Domain.Contexts.ReservationPeriod({ start, end });
  }
  set reservationPeriod(value) {
    // Convert string (VO) to Date (Mongoose)
    this.doc.reservationPeriodStart = value.start.valueOf() ? new Date(value.start.valueOf() as string) : new Date(0);
    this.doc.reservationPeriodEnd = value.end.valueOf() ? new Date(value.end.valueOf() as string) : new Date(0);
  }

  get closeRequested() {
    return this.doc.closeRequested;
  }
  set closeRequested(value) {
    this.doc.closeRequested = value;
  }
}
