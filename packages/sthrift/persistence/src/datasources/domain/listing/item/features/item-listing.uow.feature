Feature: ItemListingUnitOfWork Initialization

Background:
Given the system is configured with Mongoose, EventBus, and domain adapters

	Scenario: Initialize an ItemListingUnitOfWork successfully
		Given a valid Mongoose ItemListing model
		And a valid domain passport
		When I call getItemListingUnitOfWork with the model and passport
		Then I should receive a fully initialized ItemListingUnitOfWork instance
		And the instance should include an ItemListingRepository connected to the model
		And the instance should use ItemListingConverter for domain conversions
		And the instance should be registered with both InProcEventBusInstance and NodeEventBusInstance
		And the instance should be initialized with the provided passport

	Scenario: Attempt to initialize ItemListingUnitOfWork with an invalid model
		Given an invalid or undefined ItemListing model
		And a valid domain passport
		When I call getItemListingUnitOfWork
		Then an error should be thrown indicating the model is not valid

	Scenario: Attempt to initialize ItemListingUnitOfWork with a missing passport
		Given a valid Mongoose ItemListing model
		And an undefined or missing passport
		When I call getItemListingUnitOfWork
		Then an error should be thrown indicating the passport is required