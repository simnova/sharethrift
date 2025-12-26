Feature: ItemListingRepository

Background:
Given an ItemListingRepository instance with a configured Mongoose model, type converter, and authentication passport
And a valid ItemListing document exists in the database

	Scenario: Retrieve an item listing by ID
		When I call getById with a valid listing ID
		Then I should receive a corresponding ItemListing domain object
		And the object's title, category, location, and sharer should match the stored data

	Scenario: Attempt to retrieve a non-existent item listing by ID
		When I call getById with an invalid or non-existent listing ID
		Then an error should be thrown indicating the listing was not found

	Scenario: Create a new published item listing
		Given a valid sharer domain object
		And a set of valid listing fields without isDraft set to true
		When I call getNewInstance with the sharer and listing fields
		Then I should receive a new ItemListing domain object
		And the object's state should be "Active"
		And createdAt and updatedAt should be set to the current date

	Scenario: Create a new draft item listing
		Given a valid sharer domain object
		And a set of valid listing fields with isDraft set to true
		When I call getNewInstance with the sharer and listing fields
		Then I should receive a new ItemListing domain object
		And the object's state should be "Draft"

	Scenario: Retrieve all active (published) item listings
		When I call getActiveItemListings
		Then I should receive a list of ItemListing domain objects
		And each object should have a state of "Active"

	Scenario: Retrieve item listings by sharer ID
		Given a valid sharer ID
		When I call getBySharerID with the sharer ID
		Then I should receive a list of ItemListing domain objects
		And each object's sharer field should match the given sharer ID

	Scenario: Retrieve item listings by sharer ID with filters and pagination
		Given a valid sharer ID
		And pagination options with page and pageSize defined
		And optional filters including search text, status filters, and sorting order
		When I call getBySharerIDWithPagination with the sharer ID and options
		Then I should receive a paginated result containing items, total, page, and pageSize
		And the returned items should match the applied filters and sorting order
		And each item should include a reservationPeriod field representing the sharing period

	Scenario: Retrieve item listings with default sorting when no sorter provided
		Given a valid sharer ID
		And pagination options without a sorter
		When I call getBySharerIDWithPagination with the sharer ID and options without sorter
		Then I should receive a paginated result sorted by createdAt descending
		And the model sort method should be called with default sort