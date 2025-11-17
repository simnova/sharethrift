# Context: AppealRequest

## Domain Structure

### ListingAppealRequest (aggregate root)
- user (PersonalUser reference)
- listing (ItemListing reference)  
- blocker (PersonalUser reference)
- reason (string)
- state (AppealRequestState enum)
- type (AppealRequestType enum)

### UserAppealRequest (aggregate root)
- user (PersonalUser reference)
- blocker (PersonalUser reference)
- reason (string)
- state (AppealRequestState enum)
- type (AppealRequestType enum)

## Value Objects
- Reason: Validates appeal reason text (min 10 characters)
- State: Enum of REQUESTED | DENIED | ACCEPTED
- Type: Enum of LISTING | USER

## Notes
- Both subdomains use discriminator pattern in MongoDB (single collection)
- Appeals represent user requests to unblock listings or accounts
- State transitions managed by admin users
