Feature: <Index> Readonly Listing Context Index Exports

	Scenario: Exports from readonly listing context index
		Then the ListingContext function should be exported
		And ListingContext should be a function

	Scenario: Creating Listing Read Context
		Given a mock ModelsContext with Listing models
		And a mock Passport
		When I call ListingContext with models and passport
		Then it should return an object with ItemListing property
		And ItemListing should be defined
