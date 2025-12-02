Feature: PersonalUserPersistence Personal User Domain Persistence

	Background:
		Given a valid models context with PersonalUser model
		And a valid passport for domain operations

	Scenario: Creating Personal User Persistence
		When I call PersonalUserPersistence with models and passport
		Then I should receive an object with PersonalUserUnitOfWork property
		And the PersonalUserUnitOfWork should be properly initialized

	Scenario: PersonalUserPersistence exports
		Then PersonalUserPersistence should be exported from index
		And PersonalUserPersistence should be a function
