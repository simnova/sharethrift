Feature: <UnitOfWork> PersonalUserUnitOfWork

Background:
Given a Mongoose context factory with a working service
And a valid PersonalUser model from the models context
And a valid passport for domain operations

	Scenario: Creating a PersonalUser Unit of Work
		When I call getPersonalUserUnitOfWork with the PersonalUser model and passport
		Then I should receive a properly initialized PersonalUserUnitOfWork
		And the Unit of Work should have the correct repository type
		And the Unit of Work should have the correct converter type
		And the Unit of Work should have the correct event buses
