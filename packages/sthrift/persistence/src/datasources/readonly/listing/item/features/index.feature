Feature: ItemListingReadRepositoryImpl Item Listing Read Repository Implementation

	Background:
		Given a valid models context with ItemListing model
		And a valid passport for domain operations

	Scenario: Creating Item Listing Read Repository Implementation
		When I call ItemListingReadRepositoryImpl with models and passport
		Then I should receive an object with ItemListingReadRepo property
		And the ItemListingReadRepo should be an ItemListingReadRepository instance

	Scenario: ItemListingReadRepositoryImpl exports
		Then ItemListingReadRepositoryImpl should be exported from index
		And ItemListingReadRepositoryImpl should be a function
		And ItemListingReadRepository type should be exported from index
