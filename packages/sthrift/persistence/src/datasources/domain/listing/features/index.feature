Feature: <Index> Listing Context Index Exports

	Scenario: Exports from listing context index
		Then the ListingContextPersistence function should be exported
		And ListingContextPersistence should be a function

	Scenario: Creating Listing Context Persistence
		Given a mock ModelsContext with Listing models
		And a mock Passport
		When I call ListingContextPersistence with models and passport
		Then it should return an object with ItemListing property
