import { MongooseSeedwork } from "@cellix/data-sources-mongoose";
const { MongooseDomainAdapter, MongoTypeConverter } = MongooseSeedwork;
import type { ReservationRequestProps, Passport, } from "@ocom/api-domain";
import {  ReservationRequest as ReservationRequestAggregate } from "@ocom/api-domain"
import type { ReservationRequest } from "@ocom/api-data-sources-mongoose-models";


export class ReservationRequestDomainAdapter extends MongooseDomainAdapter<ReservationRequestModel> implements ReservationRequestProps {
  // Primitive Fields Getters and Setters
  get state() {
    return this.doc.state;
  }
  set state(value) {
    this.doc.state = value;
  }

  get listingId() {
    return this.doc.listingId;
  }
  set listingId(value: string) {
    this.doc.listingId = value;
  }

  get reserverId() {
    return this.doc.reserverId;
  }
  set reserverId(value: string) {
    this.doc.reserverId = value;
  }

  get reservationPeriod() {
    return this.doc.reservationPeriod;
  }
  set reservationPeriod(value) {
    this.doc.reservationPeriod = value;
  }

  get closeRequested() {
    return this.doc.closeRequested;
  }
  set closeRequested(value) {
    this.doc.closeRequested = value;
  }
}

/**
 * Type converter for ReservationRequest.
 * Handles conversion between Mongoose doc and domain entity.
 */
export class ReservationRequestConverter extends MongoTypeConverter<
  ReservationRequest,
  ReservationRequestDomainAdapter,
  Passport,
  ReservationRequestAggregate
> {
  constructor() {
    super(ReservationRequestDomainAdapter, ReservationRequestAggregate);
  }
}
