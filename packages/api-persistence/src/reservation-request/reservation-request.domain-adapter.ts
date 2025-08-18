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

export class ReservationRequestDomainAdapter extends MongooseDomainAdapter<Models.ReservationRequest> implements Domain.Contexts.ReservationRequestProps {
  // Primitive Fields Getters and Setters
  get state(): Domain.Contexts.ReservationRequestStateValue {
    return Domain.Contexts.ReservationRequestStateValue.create(this.doc.state);
  }

  set state(value: Domain.Contexts.ReservationRequestStateValue) {
    this.doc.state = value.valueOf();
  }

  get listing(): Domain.Contexts.ListingEntityReference {
    // Create entity reference from the stored ID and mock data
    // In a real implementation, this would potentially fetch from database or cache
    return {
      id: this.doc.listing?.toString() || "",
      title: "Mock Listing Title", // TODO: Replace with actual data source
      description: "Mock Listing Description", // TODO: Replace with actual data source
    };
  }
  set listing(value: Domain.Contexts.ListingEntityReference) {
    this.doc.listing = value.id;
  }

  get reserver(): Domain.Contexts.ReserverEntityReference {
    // Create entity reference from the stored ID and mock data  
    // In a real implementation, this would potentially fetch from database or cache
    return {
      id: this.doc.reserver?.toString() || "",
      name: "Mock Reserver Name", // TODO: Replace with actual data source
      email: "mock@example.com", // TODO: Replace with actual data source
    };
  }
  set reserver(value: Domain.Contexts.ReserverEntityReference) {
    this.doc.reserver = value.id;
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
