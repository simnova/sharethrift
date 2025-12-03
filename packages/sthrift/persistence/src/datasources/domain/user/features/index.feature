Feature: <Index> User Context Index Exports

	Scenario: Exports from user context index
		Then the UserContextPersistence function should be exported
		And UserContextPersistence should be a function

	Scenario: Creating User Context Persistence
		Given a mock ModelsContext with User models
		And a mock Passport
		When I call UserContextPersistence with models and passport
		Then it should return an object with PersonalUser property
		And it should return an object with AdminUser property
