Feature: <UnitOfWork> AdminRoleUnitOfWork

Background:
Given a Mongoose context factory with a working service
And a valid AdminRole model from the models context
And a valid passport for domain operations

	Scenario: Creating an AdminRole Unit of Work
		When I call getAdminRoleUnitOfWork with the AdminRole model and passport
		Then I should receive a properly initialized AdminRoleUnitOfWork
		And the Unit of Work should have the correct methods
