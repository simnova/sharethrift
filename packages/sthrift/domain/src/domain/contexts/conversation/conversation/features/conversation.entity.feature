Feature: Conversation Entity

Background:
	Given I have a conversation props object

Scenario: Conversation sharer reference should be readonly
	When I attempt to modify the sharer property
	Then the sharer property should be readonly

Scenario: Conversation reserver reference should be readonly
	When I attempt to modify the reserver property
	Then the reserver property should be readonly

Scenario: Conversation listing reference should be readonly
	When I attempt to modify the listing property
	Then the listing property should be readonly

Scenario: Conversation messaging ID should be a string
	When I access the messagingConversationId property
	Then it should be a string

Scenario: Conversation messages array should be readonly
	When I attempt to modify the messages property
	Then the messages property should be readonly

Scenario: Conversation loadSharer should return a promise
	When I call the loadSharer method
	Then it should return a sharer reference

Scenario: Conversation loadReserver should return a promise
	When I call the loadReserver method
	Then it should return a reserver reference

Scenario: Conversation loadListing should return a promise
	When I call the loadListing method
	Then it should return a listing reference

Scenario: Conversation loadMessages should return a promise
	When I call the loadMessages method
	Then it should return an array of messages

Scenario: Conversation timestamps should be dates
	When I access the timestamp properties
	Then createdAt and updatedAt should be Date objects

Scenario: Conversation schema version should be readonly
	When I attempt to access the schemaVersion property
	Then the schemaVersion should be a string
