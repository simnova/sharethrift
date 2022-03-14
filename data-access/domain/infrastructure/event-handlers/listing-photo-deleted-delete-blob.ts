import { NodeEventBus } from '../events/node-event-bus';
import { ListingPhotoDeletedEvent } from '../../events/listing-photo-deleted';
import { BlobStorage } from '../../../infrastructure/services/blob-storage';

export default () => { NodeEventBus.register(ListingPhotoDeletedEvent, async (payload) => {
  console.log(`ListingPhotoDeletedEvent Delete blob integration: ${JSON.stringify(payload)} and DocumentId: ${payload.documentId}`);
  const blobStorage = new BlobStorage();
  await blobStorage.deleteBlob(payload.documentId);
  });
};