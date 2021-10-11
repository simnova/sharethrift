import { DomainEventStaticProps, staticImplements,CustomDomainEventImpl } from '../shared/domain-event';

export interface ListingPublishedProps {
  listingId: string;
}

@staticImplements<DomainEventStaticProps>()
export class ListingPublishedEvent extends CustomDomainEventImpl<ListingPublishedProps>  {
  public static readonly eventId:string = "ListingPublished";
  constructor(aggregateRootId: string) {
    super(ListingPublishedEvent.eventId, aggregateRootId);
  }
}