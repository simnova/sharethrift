Feature: AdminUserPersistence Admin User Domain Persistence

	Background:
		Given a valid models context with AdminUser model
		And a valid passport for domain operations

	Scenario: Creating Admin User Persistence
		When I call AdminUserPersistence with models and passport
		Then I should receive an object with AdminUserUnitOfWork property
		And the AdminUserUnitOfWork should be properly initialized

	Scenario: AdminUserPersistence exports
		Then AdminUserPersistence should be exported from index
		And AdminUserPersistence should be a function
