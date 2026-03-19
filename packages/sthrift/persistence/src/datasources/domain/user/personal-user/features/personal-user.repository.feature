Feature: <Repository> PersonalUserRepository

Background:
Given a PersonalUserRepository instance with a working Mongoose model, type converter, and passport
And valid PersonalUser documents exist in the database

	Scenario: Getting a personal user by ID
		Given a PersonalUser document with id "user-1", email "test@example.com", and firstName "Test"
		When I call getById with "user-1"
		Then I should receive a PersonalUser domain object
		And the domain object's email should be "test@example.com"
		And the domain object's firstName should be "Test"

	Scenario: Getting a personal user by a nonexistent ID
		When I call getById with "nonexistent-id"
		Then an error should be thrown indicating "User with id nonexistent-id not found"

	Scenario: Creating a new personal user instance
		When I call getNewInstance with email "new@example.com", firstName "New", and lastName "User"
		Then I should receive a new PersonalUser domain object
		And the domain object's email should be "new@example.com"
		And the domain object's firstName should be "New"
		And the domain object's lastName should be "User"
