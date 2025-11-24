Feature: <Index> Admin Role Index Exports

	Scenario: Exports from admin role index
		Then the AdminRolePersistence function should be exported
		And AdminRolePersistence should be a function

	Scenario: Calling AdminRolePersistence returns UnitOfWork
		Given a models context and passport
		When I call AdminRolePersistence
		Then it should return an object with AdminRoleUnitOfWork
