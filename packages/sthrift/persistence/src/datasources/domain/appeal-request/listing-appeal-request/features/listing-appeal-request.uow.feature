Feature: <UnitOfWork> ListingAppealRequestUnitOfWork

Background:
Given a Mongoose context factory with a working service
And a valid ListingAppealRequest model from the models context
And a valid passport for domain operations

	Scenario: Creating a ListingAppealRequest Unit of Work
		When I call getListingAppealRequestUnitOfWork with the ListingAppealRequest model and passport
		Then I should receive a properly initialized ListingAppealRequestUnitOfWork
		And the Unit of Work should have the correct methods
