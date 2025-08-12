import { MongooseSeedwork } from "@cellix/data-sources-mongoose";
import type { HydratedDocument } from 'mongoose';
const { MongooseDomainAdapter, MongoTypeConverter } = MongooseSeedwork;
import type { ReservationRequestProps, Passport } from "@ocom/api-domain";
import { ReservationRequest as ReservationRequestAggregate } from "@ocom/api-domain"

// Define the document interface based on the mongoose schema
interface ReservationRequestDocument {
  _id?: string;
  state: string;
  reservationPeriodStart: Date;
  reservationPeriodEnd: Date;
  createdAt: Date;
  updatedAt: Date;
  schemaversion: number;
  listing: string;
  reserver: string;
  closeRequested: boolean;
}

export type ReservationRequestModel = HydratedDocument<ReservationRequestDocument>;

export class ReservationRequestDomainAdapter extends MongooseDomainAdapter<ReservationRequestModel> implements ReservationRequestProps {
  // Primitive Fields Getters and Setters
  get state() {
    return this.doc.state;
  }
  set state(value) {
    this.doc.state = value;
  }

  get listingId() {
    return this.doc.listing?.toString() || '';
  }
  set listingId(value: string) {
    this.doc.listing = value;
  }

  get reserverId() {
    return this.doc.reserver?.toString() || '';
  }
  set reserverId(value: string) {
    this.doc.reserver = value;
  }

  get reservationPeriod() {
    // This should return a ReservationPeriod value object
    // For now, returning a simple object structure that matches expected interface
    return {
      start: this.doc.reservationPeriodStart,
      end: this.doc.reservationPeriodEnd
    } as any;
  }
  set reservationPeriod(value) {
    this.doc.reservationPeriodStart = value.start;
    this.doc.reservationPeriodEnd = value.end;
  }

  get closeRequested() {
    return this.doc.closeRequested;
  }
  set closeRequested(value) {
    this.doc.closeRequested = value;
  }

  override get createdAt() {
    return this.doc.createdAt;
  }

  override get updatedAt() {
    return this.doc.updatedAt;
  }
  override set updatedAt(value: Date) {
    this.doc.updatedAt = value;
  }

  override get schemaVersion() {
    return this.doc.schemaversion?.toString() || '1';
  }
  override set schemaVersion(value: string) {
    this.doc.schemaversion = parseInt(value, 10);
  }

  override get id() {
    return this.doc._id?.toString() || '';
  }
}

/**
 * Type converter for ReservationRequest.
 * Handles conversion between Mongoose doc and domain entity.
 */
export class ReservationRequestConverter extends MongoTypeConverter<
  ReservationRequestModel,
  ReservationRequestDomainAdapter,
  Passport,
  ReservationRequestAggregate<ReservationRequestDomainAdapter>
> {
  constructor() {
    super(ReservationRequestDomainAdapter, ReservationRequestAggregate);
  }
}
