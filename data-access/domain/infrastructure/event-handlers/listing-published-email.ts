import { NodeEventBus } from '../events/node-event-bus';
import { ListingPublishedEvent, ListingPublishedProps } from '../../events/listing-published';

export default () => { NodeEventBus.register2<ListingPublishedProps,ListingPublishedEvent>(ListingPublishedEvent, async (payload) => {
    console.log(`ListingPublishedEvent: ${JSON.stringify(payload)} and ListingId: ${payload.listingId}`);
});
};