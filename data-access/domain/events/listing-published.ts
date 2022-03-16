import { CustomDomainEventImpl } from '../shared/domain-event';

export interface ListingPublishedProps {
  listingId: string;
}

export class ListingPublishedEvent extends CustomDomainEventImpl<ListingPublishedProps>  {
  constructor(aggregateRootId: string) {super(aggregateRootId);}
}