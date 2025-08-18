import { MongooseSeedwork } from "@cellix/data-sources-mongoose";
const { MongooseDomainAdapter, MongoTypeConverter } = MongooseSeedwork;
import type { ItemListingProps, Passport } from "@sthrift/api-domain";
import { Domain, ItemListing as ItemListingAggregate } from "@sthrift/api-domain";
import type { Models } from "@sthrift/api-data-sources-mongoose-models";

/**
 * Type converter for ItemListing.
 * Handles conversion between Mongoose doc and domain entity.
 */
export class ItemConverter extends MongoTypeConverter<
  Models.ItemListing,
  ItemDomainAdapter,
  Passport,
  Domain.Contexts.ItemListing<ItemDomainAdapter>
> {
  constructor() {
    super(ItemDomainAdapter, ItemListingAggregate);
  }
}

export class ItemDomainAdapter extends MongooseDomainAdapter<Models.ItemListing> implements ItemListingProps {
  // Primitive Fields Getters and Setters
  get title(): Domain.Contexts.Title {
    return Domain.Contexts.Title.create(this.doc.title);
  }
  set title(value: Domain.Contexts.Title) {
    this.doc.title = value.valueOf();
  }

  get description(): Domain.Contexts.Description {
    return Domain.Contexts.Description.create(this.doc.description);
  }
  set description(value: Domain.Contexts.Description) {
    this.doc.description = value.valueOf();
  }

  get category(): Domain.Contexts.Category {
    return Domain.Contexts.Category.create(this.doc.category);
  }
  set category(value: Domain.Contexts.Category) {
    this.doc.category = value.valueOf();
  }

  get location(): Domain.Contexts.Location {
    return Domain.Contexts.Location.create(this.doc.location);
  }
  set location(value: Domain.Contexts.Location) {
    this.doc.location = value.valueOf();
  }

  get state(): Domain.Contexts.ListingStateValue {
    return Domain.Contexts.ListingStateValue.create(this.doc.state);
  }
  set state(value: Domain.Contexts.ListingStateValue) {
    this.doc.state = value.valueOf();
  }

  get sharingPeriodStart(): Date {
    return this.doc.sharingPeriodStart;
  }
  set sharingPeriodStart(value: Date) {
    this.doc.sharingPeriodStart = value;
  }

  get sharingPeriodEnd(): Date {
    return this.doc.sharingPeriodEnd;
  }
  set sharingPeriodEnd(value: Date) {
    this.doc.sharingPeriodEnd = value;
  }

  get sharer(): Domain.Contexts.SharerEntityReference {
    return {
      id: this.doc.sharer?.toString() || "",
      name: "Mock Sharer Name", // TODO: Replace with actual data source
      email: "mock@example.com", // TODO: Replace with actual data source
    };
  }
  set sharer(value: Domain.Contexts.SharerEntityReference) {
    this.doc.sharer = value.id;
  }

  get sharingHistory(): string[] {
    return this.doc.sharingHistory || [];
  }
  set sharingHistory(value: string[]) {
    this.doc.sharingHistory = value;
  }

  get reports(): number {
    return this.doc.reports || 0;
  }
  set reports(value: number) {
    this.doc.reports = value;
  }

  get images(): string[] {
    return this.doc.images || [];
  }
  set images(value: string[]) {
    this.doc.images = value;
  }

  get createdAt(): Date {
    return this.doc.createdAt;
  }

  get updatedAt(): Date {
    return this.doc.updatedAt;
  }

  get id(): string {
    return this.doc._id?.toString() || "";
  }

  get version(): number {
    return 0; // Default version for compatibility
  }
  set version(_value: number) {
    // Not used in this implementation
  }
}