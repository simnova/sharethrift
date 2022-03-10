import { NodeEventBus } from '../events/node-event-bus';
import { ListingDraftPublishRequestedEvent } from '../../events/listing-draft-publish-requested';
import { ListingUnitOfWork } from '../persistance/repositories';
import { moderateContentBatch } from '../../../infrastructure/services/content-moderator/moderate-content-batch';

export default () => { NodeEventBus.register(ListingDraftPublishRequestedEvent, async (payload) => {

  console.log(`ListingDraftPublishRequestedEvent -> Auto Review Handler - Called with Payload: ${JSON.stringify(payload)} and UserId: ${payload.listingId}`);
  
  await ListingUnitOfWork.withTransaction(payload.context, async (repo) => {

    let listing = await repo.get(payload.listingId);
    if(!listing) {
      throw new Error(`ListingDraftPublishRequestedEvent -> Auto Review Handler - Listing with Id: ${payload.listingId} not found`);
    }

    let moderationOutcome = await moderateContentBatch(
      new Map([
        ['title', listing.draft.title],
        ['description', listing.draft.description],
        ['tags', listing.draft.tags.join(',')],
      ])
    );

    if(!moderationOutcome.batchApproved) {
      listing.draft.rejectPublish(`Please review your draft, the ${moderationOutcome.failedKey} contain content that is inappropriate.`);
    } else {
      await listing.publishApprovedDraft();
    }

    await repo.save(listing);

  });

})};