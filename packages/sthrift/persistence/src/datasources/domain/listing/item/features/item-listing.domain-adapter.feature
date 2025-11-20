Feature: <DomainAdapter> ItemListingDomainAdapter

Background:
Given an ItemListing document from the database
And an ItemListingDomainAdapter wrapping the document

	Scenario: Accessing item listing properties
		Then the domain adapter should have a title property
		And the domain adapter should have a description property
		And the domain adapter should have a category property
		And the domain adapter should have a location property
		And the domain adapter should have a state property
		And the domain adapter should have a sharer property

	Scenario: Getting item listing sharer reference
		When I access the sharer property
		Then I should receive a User reference with an id

	Scenario: Modifying item listing title
		When I set the title to "Updated Title"
		Then the title should be "Updated Title"

	Scenario: Modifying item listing state
		When I set the state to "Published"
		Then the state should be "Published"
