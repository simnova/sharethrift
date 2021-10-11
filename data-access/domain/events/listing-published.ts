import { DomainEventBase, CustomDomainEvent, DomainEventStaticProps, staticImplements } from '../shared/domain-event';

export interface ListingPublishedProps {
  listingId: string;
}

@staticImplements<DomainEventStaticProps>()
export class ListingPublishedEvent extends DomainEventBase implements CustomDomainEvent<ListingPublishedProps> {
  public static readonly eventId:string = "ListingPublished";
  private _props: ListingPublishedProps;
  constructor(aggregateRootId: string) {
    super(ListingPublishedEvent.eventId, aggregateRootId);
  }
  get payload(): ListingPublishedProps {
    return this._props;
  }
  set payload(value: ListingPublishedProps) {
    this._props = value;
  }  
}