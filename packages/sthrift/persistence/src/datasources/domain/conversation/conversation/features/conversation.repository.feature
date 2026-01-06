Feature: ConversationRepository

Background:
Given a ConversationRepository instance with a working Mongoose model, type converter, and passport
And valid Conversation documents exist in the database

	Scenario: Getting a conversation by ID with references
		Given a Conversation document with id "conv-1", sharer "user-1", reserver "user-2", and listing "listing-1"
		When I call getByIdWithReferences with "conv-1"
		Then I should receive a Conversation domain object
		And the domain object's sharer should be populated
		And the domain object's reserver should be populated
		And the domain object's listing should be populated

	Scenario: Getting a conversation by nonexistent ID
		When I call getByIdWithReferences with "nonexistent-id"
		Then an error should be thrown indicating "Conversation with id nonexistent-id not found"

	Scenario: Getting a conversation by messaging ID
		Given a Conversation document with messagingConversationId "twilio-123"
		When I call getByMessagingId with "twilio-123"
		Then I should receive a Conversation domain object
		And the domain object's messagingConversationId should be "twilio-123"

	Scenario: Getting a conversation by nonexistent messaging ID
		When I call getByMessagingId with "nonexistent-twilio-id"
		Then it should return null

	Scenario: Getting a conversation by sharer and reserver IDs
		Given a Conversation document with sharer "user-1" and reserver "user-2"
		When I call getByIdWithSharerReserver with sharer "user-1" and reserver "user-2"
		Then I should receive a Conversation domain object
		And the domain object's sharer id should be "user-1"
		And the domain object's reserver id should be "user-2"

	Scenario: Getting a conversation by nonexistent sharer and reserver IDs
		When I call getByIdWithSharerReserver with sharer "nonexistent-1" and reserver "nonexistent-2"
		Then it should return null

	Scenario: Creating a new conversation instance
		Given a sharer PersonalUser with id "user-1"
		And a reserver PersonalUser with id "user-2"
		And a listing ItemListing with id "listing-1"
		When I call getNewInstance with the sharer, reserver, and listing
		Then I should receive a new Conversation domain object
		And the domain object should have a messagingConversationId
		And the domain object's messages should be empty

	Scenario: Getting conversations by listing ID
		Given Conversation documents exist with listing "listing-1"
		When I call getByListingId with "listing-1"
		Then I should receive an array of Conversation domain objects
		And each domain object should have the listing id "listing-1"

	Scenario: Getting conversations by nonexistent listing ID
		When I call getByListingId with "nonexistent-listing"
		Then I should receive an empty array

	Scenario: Getting expired conversations
		Given Conversation documents exist with expiresAt in the past
		When I call getExpired
		Then I should receive an array of expired Conversation domain objects

	Scenario: Getting expired conversations when none exist
		Given no Conversation documents have expiresAt in the past
		When I call getExpired
		Then I should receive an empty array

	Scenario: Getting expired conversations with limit
		Given multiple Conversation documents exist with expiresAt in the past
		When I call getExpired with limit 2
		Then I should receive at most 2 Conversation domain objects
