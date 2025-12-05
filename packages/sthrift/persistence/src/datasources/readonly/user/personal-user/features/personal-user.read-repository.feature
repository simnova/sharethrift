Feature: PersonalUserReadRepository

Background:
Given a PersonalUserReadRepository instance with a working data source and passport
And valid PersonalUser documents exist in the database

	Scenario: Getting all personal users
		When I call getAll
		Then I should receive an array of PersonalUser domain objects

	Scenario: Getting all users with pagination
		Given multiple PersonalUser documents exist in the database
		When I call getAllUsers with page 1 and pageSize 10
		Then I should receive a paginated result with items, total, page, and pageSize

	Scenario: Getting all users with search text
		Given PersonalUser documents with various emails and names
		When I call getAllUsers with searchText "john"
		Then I should receive only users matching the search text

	Scenario: Getting all users with status filters
		Given PersonalUser documents with different statuses
		When I call getAllUsers with statusFilters including "Active"
		Then I should receive only active users

	Scenario: Getting a personal user by ID
		Given a PersonalUser document with id "user-1"
		When I call getById with "user-1"
		Then I should receive a PersonalUser domain object with that ID

	Scenario: Getting a personal user by ID that doesn't exist
		When I call getById with "nonexistent-id"
		Then I should receive null

	Scenario: Getting a personal user by email
		Given a PersonalUser document with email "test@example.com"
		When I call getByEmail with "test@example.com"
		Then I should receive a PersonalUser domain object with that email

	Scenario: Getting a personal user by email that doesn't exist
		When I call getByEmail with "nonexistent@example.com"
		Then I should receive null

	Scenario: Getting all users with sorter by email ascending
		Given PersonalUser documents with various emails
		When I call getAllUsers with sorter field "email" and order "ascend"
		Then I should receive users sorted by email in ascending order

	Scenario: Getting all users with sorter by email descending
		Given PersonalUser documents with various emails
		When I call getAllUsers with sorter field "email" and order "descend"
		Then I should receive users sorted by email in descending order

	Scenario: Getting all users with Blocked status filter
		Given PersonalUser documents with different statuses
		When I call getAllUsers with statusFilters including "Blocked"
		Then I should receive only blocked users

	Scenario: Getting all users with both Active and Blocked status filters
		Given PersonalUser documents with different statuses
		When I call getAllUsers with statusFilters including both "Active" and "Blocked"
		Then I should receive all users regardless of status
