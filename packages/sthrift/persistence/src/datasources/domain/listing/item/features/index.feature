Feature: ItemListingPersistence Item Listing Domain Persistence

	Background:
		Given a valid models context with ItemListing model
		And a valid passport for domain operations

	Scenario: Creating Item Listing Persistence
		When I call ItemListingPersistence with models and passport
		Then I should receive an object with ItemListingUnitOfWork property
		And the ItemListingUnitOfWork should be properly initialized

	Scenario: ItemListingPersistence exports
		Then ItemListingPersistence should be exported from index
		And ItemListingPersistence should be a function
