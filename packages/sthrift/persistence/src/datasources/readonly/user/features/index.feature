Feature: <Index> Readonly User Context Index Exports

	Scenario: Exports from readonly user context index
		Then the UserContext function should be exported
		And UserContext should be a function

	Scenario: Creating User Read Context
		Given a mock ModelsContext with User models
		And a mock Passport
		When I call UserContext with models and passport
		Then it should return an object with PersonalUser property
		And it should return an object with AdminUser property
		And it should return an object with getUserById helper
		And it should return an object with getUserByEmail helper

	Scenario: Getting user by ID finds PersonalUser
		Given a UserContext with mocked repositories
		And PersonalUser repository returns a user for ID "user-123"
		When I call getUserById with "user-123"
		Then I should receive the PersonalUser

	Scenario: Getting user by ID finds AdminUser when PersonalUser not found
		Given a UserContext with mocked repositories
		And PersonalUser repository returns null for ID "admin-456"
		And AdminUser repository returns a user for ID "admin-456"
		When I call getUserById with "admin-456"
		Then I should receive the AdminUser

	Scenario: Getting user by email finds PersonalUser
		Given a UserContext with mocked repositories
		And PersonalUser repository returns a user for email "user@example.com"
		When I call getUserByEmail with "user@example.com"
		Then I should receive the PersonalUser

	Scenario: Getting user by email finds AdminUser when PersonalUser not found
		Given a UserContext with mocked repositories
		And PersonalUser repository returns null for email "admin@example.com"
		And AdminUser repository returns a user for email "admin@example.com"
		When I call getUserByEmail with "admin@example.com"
		Then I should receive the AdminUser

