Feature: <Repository> UserAppealRequestRepository

Background:
Given a UserAppealRequestRepository instance with a working Mongoose model, type converter, and passport
And valid UserAppealRequest documents exist in the database

	Scenario: Getting a user appeal request by ID
		Given a UserAppealRequest document with id "appeal-1"
		When I call getById with "appeal-1"
		Then I should receive a UserAppealRequest domain object

	Scenario: Getting a user appeal request by a nonexistent ID
		When I call getById with "nonexistent-id"
		Then an error should be thrown indicating the user appeal request was not found

	Scenario: Creating a new user appeal request instance
		When I call getNewInstance
		Then I should receive a new UserAppealRequest domain object
