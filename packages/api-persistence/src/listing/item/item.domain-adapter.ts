import type { ItemListingProps, Passport } from "@sthrift/api-domain";
import { Domain, ItemListing as ItemListingAggregate } from "@sthrift/api-domain";
import type { ListingModels } from "@sthrift/api-data-sources-mongoose-models";

/**
 * Simplified domain adapter that implements ItemListingProps
 * without extending MongooseDomainAdapter to avoid type conflicts
 */
export class ItemListingDomainAdapter implements ItemListingProps {
  public doc: ListingModels.ItemListing;

  constructor(doc: ListingModels.ItemListing) {
    this.doc = doc;
  }

  // Primitive Fields Getters and Setters
  get title(): Domain.Contexts.Title {
    return new Domain.Contexts.Title(this.doc.title);
  }
  set title(value: Domain.Contexts.Title) {
    this.doc.title = value.valueOf();
  }

  get description(): Domain.Contexts.Description {
    return new Domain.Contexts.Description(this.doc.description);
  }
  set description(value: Domain.Contexts.Description) {
    this.doc.description = value.valueOf();
  }

  get category(): Domain.Contexts.Category {
    return new Domain.Contexts.Category(this.doc.category);
  }
  set category(value: Domain.Contexts.Category) {
    this.doc.category = value.valueOf();
  }

  get location(): Domain.Contexts.Location {
    return new Domain.Contexts.Location(this.doc.location);
  }
  set location(value: Domain.Contexts.Location) {
    this.doc.location = value.valueOf();
  }

  get state(): Domain.Contexts.ListingState {
    return new Domain.Contexts.ListingState(this.doc.state || 'Published');
  }
  set state(value: Domain.Contexts.ListingState) {
    this.doc.state = value.valueOf() as NonNullable<ListingModels.ItemListing['state']>;
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

  get sharer(): string {
    return this.doc.sharer?.toString() || "";
  }
  set sharer(value: string) {
    this.doc.sharer = value as unknown as ListingModels.ItemListing['sharer'];
  }

  get sharingHistory(): string[] {
    return (this.doc.sharingHistory || []).map(id => String(id));
  }
  set sharingHistory(value: string[]) {
    // Simple conversion - in production this would handle ObjectId conversion properly
    this.doc.sharingHistory = value as unknown as ListingModels.ItemListing['sharingHistory'] || [];
  }

  get reports(): number {
    return this.doc.reports || 0;
  }
  set reports(value: number) {
    this.doc.reports = value;
  }

  get images(): string[] {
    return []; // Images not stored in the current model
  }
  set images(_value: string[]) {
    // Images not supported in the current model
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

  // Domain expects schemaVersion as number
  get schemaVersion(): number {
    return 1; // Default version for ItemListing
  }

  get version(): number {
    return 0; // Default version for compatibility
  }
  set version(_value: number) {
    // Not used in this implementation
  }
}

/**
 * Simplified type converter that creates domain adapters and aggregates
 */
export class ItemListingConverter {
  toDomain(
    doc: ListingModels.ItemListing,
    passport: Passport
  ): Domain.Contexts.ItemListing<ItemListingDomainAdapter> {
    const adapter = new ItemListingDomainAdapter(doc);
    // Simple type workaround - in production this would be properly typed
    return new ItemListingAggregate(adapter as ItemListingProps, passport) as unknown as Domain.Contexts.ItemListing<ItemListingDomainAdapter>;
  }

  toMongo(
    domain: Domain.Contexts.ItemListing<ItemListingDomainAdapter>
  ): ListingModels.ItemListing {
    // Simple conversion - in production this would be more sophisticated
    return (domain.props as ItemListingDomainAdapter).doc;
  }
}