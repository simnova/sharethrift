Feature: <Index> Listing Appeal Request Readonly Index Exports

	Scenario: Exports from listing appeal request readonly index
		Then the getListingAppealRequestReadRepository function should be exported
		And getListingAppealRequestReadRepository should be a function
