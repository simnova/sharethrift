Feature: <ReadRepository> ListingAppealRequestReadRepository

Background:
Given a ListingAppealRequestReadRepository instance with models and passport

	Scenario: Repository initialization
		Then the read repository should be defined
		And the read repository should have a getAll method
		And the read repository should have a getById method

	Scenario: Getting all appeal requests
		When I call getAll with pagination parameters
		Then it should return an empty paginated result

	Scenario: Getting an appeal request by ID when not found
		When I call getById with a nonexistent ID
		Then it should return null
