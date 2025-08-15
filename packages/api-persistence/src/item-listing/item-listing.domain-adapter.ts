import type { HydratedDocument } from 'mongoose';
import type { ItemListingProps, Passport } from "@sthrift/api-domain";
import { ItemListing as ItemListingAggregate, Title, Description, Category, Location, ListingState } from "@sthrift/api-domain";

// Define the document interface based on the mongoose schema
interface ItemListingDocument {
  _id?: string;
  sharer: string;
  title: string;
  description: string;
  category: string;
  location: string;
  sharingPeriodStart: Date;
  sharingPeriodEnd: Date;
  state: string;
  createdAt: Date;
  updatedAt: Date;
  schemaversion: number;
  sharingHistory?: string[];
  reports?: number;
  images?: string[];
}

export type ItemListingModel = HydratedDocument<ItemListingDocument>;

export class ItemListingDomainAdapter implements ItemListingProps {
  public readonly doc: ItemListingModel;

  constructor(doc: ItemListingModel) {
    this.doc = doc;
  }

  // Primitive Fields Getters and Setters
  get sharer() {
    return this.doc.sharer?.toString() || '';
  }
  set sharer(value: string) {
    this.doc.sharer = value;
  }

  get title() {
    return new Title(this.doc.title || '');
  }
  set title(value: Title) {
    this.doc.title = value.valueOf();
  }

  get description() {
    return new Description(this.doc.description || '');
  }
  set description(value: Description) {
    this.doc.description = value.valueOf();
  }

  get category() {
    return new Category(this.doc.category || '');
  }
  set category(value: Category) {
    this.doc.category = value.valueOf();
  }

  get location() {
    return new Location(this.doc.location || '');
  }
  set location(value: Location) {
    this.doc.location = value.valueOf();
  }

  get state() {
    return new ListingState(this.doc.state || '');
  }
  set state(value: ListingState) {
    this.doc.state = value.valueOf();
  }

  get createdAt() {
    return this.doc.createdAt;
  }

  get updatedAt() {
    return this.doc.updatedAt;
  }

  get sharingPeriodStart() {
    return this.doc.sharingPeriodStart;
  }
  set sharingPeriodStart(value: Date) {
    this.doc.sharingPeriodStart = value;
  }

  get sharingPeriodEnd() {
    return this.doc.sharingPeriodEnd;
  }
  set sharingPeriodEnd(value: Date) {
    this.doc.sharingPeriodEnd = value;
  }

  get schemaVersion() {
    return this.doc.schemaversion || 1;
  }
  set schemaVersion(value: number) {
    this.doc.schemaversion = value;
  }

  get sharingHistory() {
    return this.doc.sharingHistory || [];
  }
  set sharingHistory(value: string[]) {
    this.doc.sharingHistory = value;
  }

  get reports() {
    return this.doc.reports || 0;
  }
  set reports(value: number) {
    this.doc.reports = value;
  }

  get images() {
    return this.doc.images || [];
  }
  set images(value: string[]) {
    this.doc.images = value;
  }

  get id() {
    return this.doc._id?.toString() || '';
  }

  get version() {
    return 0; // Default version for compatibility
  }
  set version(_value: number) {
    // Not used in this implementation
  }
}

/**
 * Simple converter for ItemListing.
 * Handles conversion between Mongoose doc and domain entity.
 */
export const ItemListingConverter = {
  toDomain(doc: ItemListingModel, passport: Passport): ItemListingAggregate<ItemListingDomainAdapter> {
    const adapter = new ItemListingDomainAdapter(doc);
    return new ItemListingAggregate(adapter, passport);
  }
};
