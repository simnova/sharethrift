import { CustomDomainEventImpl } from '../shared/domain-event';

export interface ListingDraftPublishRequestedProps {
  listingId: string;
}

export class ListingDraftPublishRequestedEvent extends CustomDomainEventImpl<ListingDraftPublishRequestedProps>  {
  constructor(aggregateRootId: string) {super(aggregateRootId);}
}