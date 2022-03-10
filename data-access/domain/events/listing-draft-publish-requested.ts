import { DomainExecutionContext } from '../contexts/context';
import { CustomDomainEventImpl } from '../shared/domain-event';

export interface ListingDraftPublishRequestedProps {
  listingId: string;
  context: DomainExecutionContext;
}

export class ListingDraftPublishRequestedEvent extends CustomDomainEventImpl<ListingDraftPublishRequestedProps>  {
  constructor(aggregateRootId: string) {super(aggregateRootId);}
}