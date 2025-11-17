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
		And it should map state values like "Published" to "Active" and "Drafted" to "Draft"
		And it should return items, total, page, and pageSize in the response
    
    Scenario: Querying myListingsAll with search and filters
		Given a verified user and valid pagination arguments
		And a searchText "camera" and statusFilters ["Published"]
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
		Then each listing should include id, title, image, publishedAt, reservationPeriod, status, and pendingRequestsCount
		And missing images should map image to null
		And missing or blank states should map status to "Unknown"