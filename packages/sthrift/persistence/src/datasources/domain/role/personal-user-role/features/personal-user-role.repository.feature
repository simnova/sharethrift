Feature: <Repository> PersonalUserRoleRepository

Background:
Given a PersonalUserRoleRepository instance with a working Mongoose model, type converter, and passport
And valid PersonalUserRole documents exist in the database

	Scenario: Getting a personal user role by ID
		Given a PersonalUserRole document with id "role-1", roleName "Admin", and isDefault true
		When I call getById with "role-1"
		Then I should receive a PersonalUserRole domain object
		And the domain object's roleName should be "Admin"
		And the domain object's isDefault should be true

	Scenario: Getting a personal user role by a nonexistent ID
		When I call getById with "nonexistent-id"
		Then an error should be thrown indicating "EndUserRole with id nonexistent-id not found"

	Scenario: Creating a new personal user role instance
		When I call getNewInstance with roleName "Editor" and isDefault false
		Then I should receive a new PersonalUserRole domain object
		And the domain object's roleName should be "Editor"
		And the domain object's isDefault should be false

	Scenario: Creating a new personal user role instance with default flag set
		When I call getNewInstance with roleName "Viewer" and isDefault true
		Then I should receive a new PersonalUserRole domain object
		And the domain object's roleName should be "Viewer"
		And the domain object's isDefault should be true

	Scenario: Creating a new personal user role instance with invalid data
		Given an invalid role name (e.g., an empty string)
		When I call getNewInstance with the invalid role name and isDefault false
		Then an error should be thrown indicating the role name is not valid