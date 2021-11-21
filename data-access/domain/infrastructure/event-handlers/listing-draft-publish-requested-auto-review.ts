import { NodeEventBus } from '../events/node-event-bus';
import { ListingDraftPublishRequestedEvent } from '../../events/listing-draft-publish-requested';
import { ListingUnitOfWork } from '../persistance/repositories';
import { ContentModerator, ModeratedContentType } from '../../../infrastructure/services/content-moderator';

export default () => { NodeEventBus.register(ListingDraftPublishRequestedEvent, async (payload) => {

  console.log(`ListingDraftPublishRequestedEvent -> Auto Review Handler - Called with Payload: ${JSON.stringify(payload)} and UserId: ${payload.listingId}`);
  
  await ListingUnitOfWork.withTransaction(async (repo) => {

    let listing = await repo.get(payload.listingId);
    if(!listing) {
      throw new Error(`ListingDraftPublishRequestedEvent -> Auto Review Handler - Listing with Id: ${payload.listingId} not found`);
    }

    let moderateContent = async (contentWithKeys:Map<string,string>): Promise<[boolean,string]> => {
      let contentModerator = new ContentModerator();
      for(let key in contentWithKeys) {
        let result = await contentModerator.moderateText(contentWithKeys[key], ModeratedContentType.PlainText);
        if(!result.IsApproved) {
          return [false, key];
        }
      }
      return [true, ''];
    } 

    let moderationOutcome = await moderateContent(
      new Map([
        ['title', listing.draft.title],
        ['description', listing.draft.description],
        ['tags', listing.draft.tags.join(',')],
      ])
    );

    if(!moderationOutcome[0]) {
      listing.draft.rejectPublish(`Please review your draft, the ${moderationOutcome[1]} contain content that is inappropriate.`);
    } else {
      await listing.publishApprovedDraft();
    }

    await repo.save(listing);

  });

})};