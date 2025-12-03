Feature: Item Listing Entity

Background:
	Given I have an item listing props object

Scenario: Item listing sharer reference should be readonly
	When I attempt to modify the sharer property
	Then the sharer property should be readonly

Scenario: Item listing title should be a string
	When I access the title property
	Then it should be a string

Scenario: Item listing description should be a string
	When I access the description property
	Then it should be a string

Scenario: Item listing category should be a string
	When I access the category property
	Then it should be a string

Scenario: Item listing location should be a string
	When I access the location property
	Then it should be a string

Scenario: Item listing sharing period dates should be Date objects
	When I access the sharing period properties
	Then sharingPeriodStart and sharingPeriodEnd should be Date objects

Scenario: Item listing state should be a string
	When I access the state property
	Then it should be a string

Scenario: Item listing createdAt should be readonly
	When I access the createdAt property
	Then it should be a Date object

Scenario: Item listing updatedAt should be a date
	When I access the updatedAt property
	Then it should be a Date object

Scenario: Item listing schemaVersion should be readonly
	When I access the schemaVersion property
	Then it should be a string

Scenario: Item listing listingType should be a string
	When I access the listingType property
	Then it should be a string

Scenario: Item listing optional arrays should be supported
	Given I have an item listing props object with optional arrays
	When I access the optional array properties
	Then they should be arrays or numbers
