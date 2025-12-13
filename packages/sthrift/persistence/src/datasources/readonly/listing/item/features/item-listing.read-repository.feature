Feature: <ReadRepository> ItemListingReadRepository

Background:
Given an ItemListingReadRepository instance with models and passport

	Scenario: Repository initialization
		Then the read repository should be defined
		And the read repository should have a getAll method
		And the read repository should have a getById method

	Scenario: Getting all item listings
		When I call getAll
		Then I should receive an array of ItemListing domain objects

	Scenario: Getting paged listings with basic pagination
		Given multiple ItemListing documents exist
		When I call getPaged with page 1 and pageSize 10
		Then I should receive a paginated result

	Scenario: Getting paged listings with sharerId filter
		Given ItemListing documents with different sharers
		When I call getPaged with sharerId filter
		Then I should receive listings filtered by sharer

	Scenario: Getting paged listings with invalid sharerId
		When I call getPaged with invalid sharerId
		Then I should receive empty result

	Scenario: Getting paged listings with search text
		Given ItemListing documents with various titles and descriptions
		When I call getPaged with searchText "laptop"
		Then I should receive matching listings

	Scenario: Getting paged listings with status filters
		Given ItemListing documents with different statuses
		When I call getPaged with status filters
		Then I should receive listings filtered by status

	Scenario: Getting paged listings with sorter ascending
		Given ItemListing documents with different dates
		When I call getPaged with sorter field "createdAt" and order "ascend"
		Then I should receive listings sorted ascending

	Scenario: Getting paged listings with sorter descending
		Given ItemListing documents with different dates
		When I call getPaged with sorter field "createdAt" and order "descend"
		Then I should receive listings sorted descending

	Scenario: Getting paged listings with default sort
		Given ItemListing documents
		When I call getPaged without sorter
		Then I should receive listings with default sort

	Scenario: Getting item listing by ID
		Given an ItemListing document with id "listing-123"
		When I call getById with "listing-123"
		Then I should receive an ItemListing domain object

	Scenario: Getting item listing by ID that doesn't exist
		When I call getById with "nonexistent-id"
		Then I should receive null

	Scenario: Getting listings by sharer
		Given ItemListing documents for sharer "sharer-123"
		When I call getBySharer with "sharer-123"
		Then I should receive listings for that sharer

	Scenario: Getting listings by empty sharer ID
		When I call getBySharer with empty string
		Then I should receive empty array

	Scenario: Getting listings by invalid sharer ID
		When I call getBySharer with invalid ObjectId
		Then I should receive empty array due to error
