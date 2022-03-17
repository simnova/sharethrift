import {default as RegisterListingPublishedEmailHandler} from './listing-published-email';
import {default as RegisterListingPublishedDomainEventHandler} from './listing-published-domain';
import {default as RegisterListingPublishedSendFaxHandler} from './listing-published-sendfax';
import {default as ResisterUserCreatedCreateAccountHandler} from './user-created-create-account';
import {default as ResisterUserCreatedCreateCategoryHandler} from './user-created-create-category';
import {default as RegisterListingPublishedUpdateSearchIndexHandler} from './listing-published-update-searchindex';
import {default as RegisterListingUnpublishedUpdateSearchIndexHandler} from './listing-unpublished-update-searchindex';
import {default as RegisterListingDraftPublishRequestedAutoReviewHandler } from './listing-draft-publish-requested-auto-review';
import {default as RegisterListingPhotoDeletedDeleteBlobHandler} from './listing-photo-deleted-delete-blob'

var RegisterHandlers = () => {
    // Register all event handlers
    RegisterListingPublishedEmailHandler();
    RegisterListingPublishedDomainEventHandler();
    RegisterListingPublishedSendFaxHandler();
    ResisterUserCreatedCreateAccountHandler();
    ResisterUserCreatedCreateCategoryHandler();
    RegisterListingPublishedUpdateSearchIndexHandler();
    RegisterListingUnpublishedUpdateSearchIndexHandler();
    RegisterListingDraftPublishRequestedAutoReviewHandler();
    RegisterListingPhotoDeletedDeleteBlobHandler();
}

export default RegisterHandlers;