import { NodeEventBus } from '../events/node-event-bus';
import { ListingPublishedEvent } from '../../events/listing-published';
import { ListingIndexDocument, listingIndexSpec } from './listing-published-update-searchindex-format';
import { CognativeSearch } from '../../../infrastructure/services/cognative-search';
import { ListingUnitOfWork } from '../persistance/repositories';
import { SystemExecutionContext } from '../persistance/execution-context';


export default () => { NodeEventBus.register(ListingPublishedEvent, async (payload) => {
  console.log(`ListingPublishedEvent Search Index Integration: ${JSON.stringify(payload)} and ListingId: ${payload.listingId}`);

  const context = await SystemExecutionContext();
  await ListingUnitOfWork.withTransaction(context,async (repo) => {

    let listing = await repo.get(payload.listingId);
    let listingDoc:Partial<ListingIndexDocument> = {
      id: listing.id,
      title: listing.title,
      description: listing.description,
      primaryCategory: listing.primaryCategory.name,
      tags: listing.tags
    };
    let cognativeSearch = new CognativeSearch();
    await cognativeSearch.createIndexIfNotExists(listingIndexSpec.name, listingIndexSpec);
    await cognativeSearch.indexDocument(listingIndexSpec.name, listingDoc);
  
  });

})};