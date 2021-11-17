import { NodeEventBus } from '../events/node-event-bus';
import { ListingPublishedEvent } from '../../events/listing-published';

export default () => { NodeEventBus.register(ListingPublishedEvent, async (payload) => {
  console.log(`ListingPublishedEvent Send Email Integration: ${JSON.stringify(payload)} and ListingId: ${payload.listingId}`);
  //throw new Error('ListingPublishedEvent Integration: Error');
  });
};