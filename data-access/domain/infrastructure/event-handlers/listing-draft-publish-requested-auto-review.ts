import { NodeEventBus } from '../events/node-event-bus';
import { ListingDraftPublishRequestedEvent } from '../../events/listing-draft-publish-requested';
import { ListingUnitOfWork } from '../persistance/repositories';
import { ContentModerator, ModeratedContentType } from '../../../infrastructure/services/content-moderator';

export default () => { NodeEventBus.register(ListingDraftPublishRequestedEvent, async (payload) => {

  console.log(`ListingDraftPublishRequestedEvent -> Auto Review Handler - Called with Payload: ${JSON.stringify(payload)} and UserId: ${payload.listingId}`);
  
  await ListingUnitOfWork.withTransaction(async (repo) => {

    let listing = await repo.get(payload.listingId);
    console.log(`ListingDraftPublishRequestedEvent -> Auto Review Handler - Listing: ${JSON.stringify(listing)}`);
    console.log(`ListingDraftPublishRequestedEvent -> Auto Review Handler - Listing.draft.title: ${listing.draft.title}`);
    console.log(`ListingDraftPublishRequestedEvent -> Auto Review Handler - Listing.draft.description: ${listing.draft.description}`);
    let contentModerator = new ContentModerator();
    let titleResult = await contentModerator.moderateText(listing.draft.title, ModeratedContentType.PlainText);
    let descriptionResult = await contentModerator.moderateText(listing.draft.description, ModeratedContentType.PlainText);

    if(!titleResult.IsApproved || !descriptionResult.IsApproved) {
      var rejectionReason =  `Title: ${titleResult.IsApproved ? 'Approved' : 'Rejected'} - Description: ${descriptionResult.IsApproved ? 'Approved' : 'Rejected'}`;
      listing.draft.rejectPublish(rejectionReason);
    } else {
      await listing.publishApprovedDraft();
    }

    await repo.save(listing);
  });

})};