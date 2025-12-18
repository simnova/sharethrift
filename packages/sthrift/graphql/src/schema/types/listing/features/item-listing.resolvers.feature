Feature: Item Listing Resolvers

As an API consumer
I want to query and mutate item listing entities
So that I can view, filter, and create listings through the GraphQL API

	Scenario: Querying item listings for a verified user
		Given a user with a verifiedJwt in their context
		When the itemListings query is executed
		Then it should call Listing.ItemListing.queryAll
		And it should return a list of item listings

	Scenario: Querying item listings without authentication
		Given a user without a verifiedJwt in their context
		When the itemListings query is executed
		Then it should call Listing.ItemListing.queryAll
		And it should return all available listings

	Scenario: Error while querying item listings
		Given Listing.ItemListing.queryAll throws an error
		When the itemListings query is executed
		Then it should propagate the error message

	Scenario: Querying a single item listing by ID
		Given a valid listing ID
		When the itemListing query is executed with that ID
		Then it should call Listing.ItemListing.queryById with the provided ID
		And it should return the corresponding listing

	Scenario: Querying an item listing that does not exist
		Given a listing ID that does not match any record
		When the itemListing query is executed
		Then it should return null

    Scenario: Error while querying a single item listing
		Given Listing.ItemListing.queryById throws an error
		When the itemListing query is executed
		Then it should propagate the error message

	Scenario: Querying paginated listings for the current user
		Given a user with a verifiedJwt in their context
		And valid pagination arguments (page, pageSize)
		When the myListingsAll query is executed
		Then it should call Listing.ItemListing.queryPaged with sharerId, page, and pageSize
        And it should transform each listing into ListingAll shape
		And it should map state values like "Active" to "Active" and "Draft" to "Draft"
		And it should return items, total, page, and pageSize in the response
    
    Scenario: Querying myListingsAll with search and filters
		Given a verified user and valid pagination arguments
		And a searchText "camera" and statusFilters ["Active"]
		When the myListingsAll query is executed
		Then it should call Listing.ItemListing.queryPaged with those filters
		And it should return matching listings only

	Scenario: Querying myListingsAll without authentication
		Given a user without a verifiedJwt in their context
		When the myListingsAll query is executed
		Then it should call Listing.ItemListing.queryPaged without sharerId
        And it should still return paged results

	Scenario: Error while querying myListingsAll
		Given Listing.ItemListing.queryPaged throws an error
		When the myListingsAll query is executed
		Then it should propagate the error message

	Scenario: Creating an item listing successfully
		Given a user with a verifiedJwt containing email
		And a valid CreateItemListingInput with title, description, category, location, sharing period, and images
		When the createItemListing mutation is executed
		Then it should call User.PersonalUser.queryByEmail with the user's email
		And call Listing.ItemListing.create with the constructed command
		And it should return the created listing

	Scenario: Creating an item listing without authentication
		Given a user without a verifiedJwt in their context
		When the createItemListing mutation is executed
		Then it should throw an "Authentication required" error

	Scenario: Creating an item listing for a non-existent user
		Given a user with a verifiedJwt containing an email not found in the database
		When the createItemListing mutation is executed
		Then it should throw a "User not found" error

    Scenario: Error while creating an item listing
		Given Listing.ItemListing.create throws an error
		When the createItemListing mutation is executed
		Then it should propagate the error message
    
	Scenario: Mapping item listing fields for myListingsAll
		Given a valid result from queryPaged
		When items are mapped
		Then each listing should include id, title, image, createdAt, reservationPeriod, status, and pendingRequestsCount
		And missing images should map image to null
		And missing or blank states should map status to "Unknown"

	Scenario: Querying adminListings with all filters
		Given an admin user with valid credentials
		And pagination arguments with searchText, statusFilters, and sorter
		When the adminListings query is executed
		Then it should call Listing.ItemListing.queryPaged with all provided parameters
		And it should return paginated results

	Scenario: Querying adminListings without any filters
		Given an admin user with valid credentials
		When the adminListings query is executed with only page and pageSize
		Then it should call Listing.ItemListing.queryPaged with minimal parameters
		And it should return all listings

	Scenario: Unblocking a listing successfully
		Given a valid listing ID to unblock
		When the unblockListing mutation is executed
		Then it should call Listing.ItemListing.unblock with the ID
		And it should return true

	Scenario: Canceling an item listing successfully
		Given a valid listing ID to cancel
		When the cancelItemListing mutation is executed
		Then it should call Listing.ItemListing.cancel with the ID
		And it should return success status and the canceled listing

	Scenario: Deleting an item listing successfully
		Given a valid listing ID and authenticated user email
		When the deleteItemListing mutation is executed
		Then it should call Listing.ItemListing.deleteListings with ID and email
		And it should return success status

	Scenario: Updating an item listing successfully
		Given a valid listing ID and authenticated user owns the listing
		And an UpdateItemListingInput with updated fields
		When the updateItemListing mutation is executed
		Then it should call Listing.ItemListing.update with the updated command
		And it should return the updated listing

	Scenario: Updating an item listing without authentication
		Given a user without a verifiedJwt in their context
		When the updateItemListing mutation is executed
		Then it should throw an "Authentication required" error

	Scenario: Updating a listing that does not exist
		Given an authenticated user
		And a listing ID that does not match any record
		When the updateItemListing mutation is executed
		Then it should throw a "Listing not found" error

	Scenario: Updating a listing owned by another user
		Given an authenticated user
		And a listing owned by a different user
		When the updateItemListing mutation is executed
		Then it should throw an "Only the listing owner can perform this action" error

	Scenario: Updating a listing when user lookup fails
		Given an authenticated user with email
		And the user cannot be found by email
		When the updateItemListing mutation is executed
		Then it should throw a "User not found" error

	Scenario: Pausing an item listing successfully
		Given a valid listing ID and authenticated user owns the listing
		When the pauseItemListing mutation is executed
		Then it should call Listing.ItemListing.pause with the ID
		And it should return the paused listing

	Scenario: Pausing an item listing without authentication
		Given a user without a verifiedJwt in their context
		When the pauseItemListing mutation is executed
		Then it should throw an "Authentication required" error

	Scenario: Pausing a listing that does not exist
		Given an authenticated user
		And a listing ID that does not match any record
		When the pauseItemListing mutation is executed
		Then it should throw a "Listing not found" error

	Scenario: Pausing a listing owned by another user
		Given an authenticated user
		And a listing owned by a different user
		When the pauseItemListing mutation is executed
		Then it should throw an "Only the listing owner can perform this action" error

	Scenario: Pausing a listing when user lookup fails
		Given an authenticated user with email
		And the user cannot be found by email
		When the pauseItemListing mutation is executed
		Then it should throw a "User not found" error

	Scenario: Canceling a listing that does not exist
		Given an authenticated user
		And a listing ID that does not match any record
		When the cancelItemListing mutation is executed
		Then it should throw a "Listing not found" error

	Scenario: Canceling a listing owned by another user
		Given an authenticated user
		And a listing owned by a different user
		When the cancelItemListing mutation is executed
		Then it should throw an "Only the listing owner can perform this action" error

	Scenario: Canceling a listing when user lookup fails
		Given an authenticated user with email
		And the user cannot be found by email
		When the cancelItemListing mutation is executed
		Then it should throw a "User not found" error

	Scenario: Deleting a listing that does not exist
		Given an authenticated user
		And a listing ID that does not match any record
		When the deleteItemListing mutation is executed
		Then it should throw a "Listing not found" error

	Scenario: Deleting a listing owned by another user
		Given an authenticated user
		And a listing owned by a different user
		When the deleteItemListing mutation is executed
		Then it should throw an "Only the listing owner can perform this action" error

	Scenario: Deleting a listing when user lookup fails
		Given an authenticated user with email
		And the user cannot be found by email
		When the deleteItemListing mutation is executed
		Then it should throw a "User not found" error