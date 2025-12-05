Feature: <DataSource> ItemListingDataSource

Background:
Given an ItemListingDataSource instance with model

	Scenario: DataSource initialization
		Then the data source should be defined
		And the data source should have a model property
