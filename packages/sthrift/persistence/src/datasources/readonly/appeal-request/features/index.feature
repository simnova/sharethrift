Feature: <Index> Readonly Appeal Request Context Index Exports

	Scenario: Exports from readonly appeal request context index
		Then the AppealRequestContext function should be exported
		And AppealRequestContext should be a function

	Scenario: Creating Appeal Request Read Context
		Given a mock ModelsContext with AppealRequest models
		And a mock Passport
		When I call AppealRequestContext with models and passport
		Then it should return an object with ListingAppealRequest property
		And it should return an object with UserAppealRequest property
