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
		When I set the state to "Active"
		Then the state should be "Active"

	Scenario: Setting and getting description
		When I set the description to "New description"
		Then the description should be "New description"

	Scenario: Setting and getting category
		When I set the category to "Furniture"
		Then the category should be "Furniture"

	Scenario: Setting and getting location
		When I set the location to "Los Angeles"
		Then the location should be "Los Angeles"

	Scenario: Setting and getting sharingPeriodStart
		When I set the sharingPeriodStart to a specific date
		Then the sharingPeriodStart should match that date

	Scenario: Setting and getting sharingPeriodEnd
		When I set the sharingPeriodEnd to a specific date
		Then the sharingPeriodEnd should match that date

	Scenario: Getting sharer when populated as PersonalUser
		When the sharer is a populated PersonalUser document
		Then I should receive a PersonalUserDomainAdapter

	Scenario: Getting sharer when populated as AdminUser
		When the sharer is a populated AdminUser document
		Then I should receive an AdminUserDomainAdapter

	Scenario: Loading sharer when it's an ObjectId
		When the sharer is an ObjectId and I call loadSharer
		Then it should populate the sharer field
		And return a domain adapter

	Scenario: Setting sharer with valid reference
		When I set the sharer property with a valid user reference
		Then the document sharer field should be updated with ObjectId

	Scenario: Setting sharer with missing id throws error
		When I set the sharer property with a reference missing id
		Then it should throw an error about user reference missing id

	Scenario: Setting and getting sharingHistory
		When I set sharingHistory to an array of ids
		Then sharingHistory should return the same array

	Scenario: Setting and getting reports
		When I set reports to 5
		Then reports should be 5

	Scenario: Setting and getting images
		When I set images to an array of URLs
		Then images should return the same array

	Scenario: Setting and getting listingType
		When I set listingType to "rental"
		Then listingType should be "rental"

	Scenario: Getting default state when not set
		When the document state is null
		Then the state getter should return "Active"

	Scenario: Setting and getting expiresAt
		When I set expiresAt to a specific date
		Then expiresAt should return that date

	Scenario: Getting expiresAt when not set returns undefined
		When I get expiresAt when it's not set
		Then it should return undefined
