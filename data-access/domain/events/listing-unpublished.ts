import { CustomDomainEventImpl } from '../shared/domain-event';

export interface ListingUnpublishedProps {
  listingId: string;
}

export class ListingUnpublishedEvent extends CustomDomainEventImpl<ListingUnpublishedProps>  {
  constructor(aggregateRootId: string) {super(aggregateRootId);}
}