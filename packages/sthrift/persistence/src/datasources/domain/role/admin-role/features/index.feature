Feature: AdminRolePersistence Admin Role Domain Persistence

	Background:
		Given a valid models context with AdminRole model
		And a valid passport for domain operations

	Scenario: Creating Admin Role Persistence
		When I call AdminRolePersistence with models and passport
		Then I should receive an object with AdminRoleUnitOfWork property
		And the AdminRoleUnitOfWork should be properly initialized

	Scenario: AdminRolePersistence exports
		Then AdminRolePersistence should be exported from index
		And AdminRolePersistence should be a function
