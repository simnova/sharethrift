Feature: <Repository> AdminRoleRepository

Background:
Given an AdminRoleRepository instance with a working Mongoose model, type converter, and passport
And valid AdminRole documents exist in the database

	Scenario: Getting an admin role by ID
		Given an AdminRole document with id "role-1"
		When I call getById with "role-1"
		Then I should receive an AdminRole domain object

	Scenario: Getting an admin role by a nonexistent ID
		When I call getById with "nonexistent-id"
		Then an error should be thrown indicating the admin role was not found

	Scenario: Creating a new admin role instance
		When I call getNewInstance
		Then I should receive a new AdminRole domain object
