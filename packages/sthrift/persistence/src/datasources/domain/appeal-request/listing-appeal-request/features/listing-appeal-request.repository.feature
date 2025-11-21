Feature: <Repository> ListingAppealRequestRepository

Background:
Given a ListingAppealRequestRepository instance with a working Mongoose model, type converter, and passport
And valid ListingAppealRequest documents exist in the database

	Scenario: Getting a listing appeal request by ID
		Given a ListingAppealRequest document with id "appeal-1"
		When I call getById with "appeal-1"
		Then I should receive a ListingAppealRequest domain object

	Scenario: Getting a listing appeal request by a nonexistent ID
		When I call getById with "nonexistent-id"
		Then an error should be thrown indicating the listing appeal request was not found

	Scenario: Creating a new listing appeal request instance
		When I call getNewInstance
		Then I should receive a new ListingAppealRequest domain object
