Feature: <Index> Appeal Request Context Index Exports

	Scenario: Exports from appeal request context index
		Then the AppealRequestContextPersistence function should be exported
		And AppealRequestContextPersistence should be a function
		And ListingAppealRequest namespace should be exported
		And UserAppealRequest namespace should be exported

	Scenario: Creating Appeal Request Context Persistence
		Given a mock ModelsContext with AppealRequest models
		And a mock Passport
		When I call AppealRequestContextPersistence with models and passport
		Then it should return an object with ListingAppealRequest property
		And it should return an object with UserAppealRequest property
		And ListingAppealRequest should have ListingAppealRequestUnitOfWork
		And UserAppealRequest should have UserAppealRequestUnitOfWork
