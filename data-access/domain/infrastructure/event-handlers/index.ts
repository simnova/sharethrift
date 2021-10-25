import {default as RegisterListingPublishedEmailHandler} from './listing-published-email';
import {default as RegisterListingPublishedDomainEventHandler} from './listing-published-domain';
import {default as RegisterListingPublishedSendFaxHandler} from './listing-published-sendfax';
import {default as ResisterUserCreatedCreateAccountHandler} from './user-created-create-account';
import {default as ResisterUserCreatedCreateCategoryHandler} from './user-created-create-category';


var  RegisterHandlers = () => {
    // Register all event handlers
    RegisterListingPublishedEmailHandler();
    RegisterListingPublishedDomainEventHandler();
    RegisterListingPublishedSendFaxHandler();
    ResisterUserCreatedCreateAccountHandler();
    ResisterUserCreatedCreateCategoryHandler();
}

export default RegisterHandlers;