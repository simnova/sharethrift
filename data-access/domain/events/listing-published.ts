import { DomainExecutionContext } from '../contexts/context';
import { CustomDomainEventImpl } from '../shared/domain-event';

export interface ListingPublishedProps {
  listingId: string;
  context: DomainExecutionContext;
}

export class ListingPublishedEvent extends CustomDomainEventImpl<ListingPublishedProps>  {
  constructor(aggregateRootId: string) {super(aggregateRootId);}
}