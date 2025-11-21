Feature: <UnitOfWork> UserAppealRequestUnitOfWork

Background:
Given a Mongoose context factory with a working service
And a valid UserAppealRequest model from the models context
And a valid passport for domain operations

	Scenario: Creating a UserAppealRequest Unit of Work
		When I call getUserAppealRequestUnitOfWork with the UserAppealRequest model and passport
		Then I should receive a properly initialized UserAppealRequestUnitOfWork
		And the Unit of Work should have the correct methods
