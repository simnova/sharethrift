Feature: ConversationReadRepository

Background:
Given a ConversationReadRepository instance with a working Mongoose model and passport
And valid Conversation documents exist in the database

	Scenario: Getting all conversations
		Given multiple Conversation documents in the database
		When I call getAll
		Then I should receive an array of Conversation entities
		And the array should contain all conversations

	Scenario: Getting a conversation by ID
		Given a Conversation document with id "conv-1"
		When I call getById with "conv-1"
		Then I should receive a Conversation entity
		And the entity's id should be "conv-1"

	Scenario: Getting a conversation by nonexistent ID
		When I call getById with "nonexistent-id"
		Then it should return null

	Scenario: Getting conversations by user ID as sharer
		Given a Conversation document with sharer "user-1"
		When I call getByUser with "user-1"
		Then I should receive an array of Conversation entities
		And the array should contain conversations where user is sharer

	Scenario: Getting conversations by user ID as reserver
		Given a Conversation document with reserver "user-2"
		When I call getByUser with "user-2"
		Then I should receive an array of Conversation entities
		And the array should contain conversations where user is reserver

	Scenario: Getting conversations by user ID with no conversations
		When I call getByUser with "user-without-conversations"
		Then I should receive an empty array

	Scenario: Getting conversations with empty or invalid user ID
		When I call getByUser with an empty string
		Then I should receive an empty array

	Scenario: Getting conversation by sharer, reserver, and listing IDs
		Given a conversation with specific sharer, reserver, and listing
		When I call getBySharerReserverListing with valid IDs
		Then I should receive a Conversation entity
		And the entity should match the criteria

	Scenario: Getting conversation by sharer, reserver, and listing with no match
		When I call getBySharerReserverListing with non-matching IDs
		Then it should return null

	Scenario: Getting conversation by sharer, reserver, and listing with empty parameters
		When I call getBySharerReserverListing with empty parameters
		Then it should return null

	Scenario: Getting conversation by sharer, reserver, and listing with partial empty parameters
		When I call getBySharerReserverListing with partial empty parameters
		Then it should return null

	Scenario: Getting conversation by sharer, reserver, and listing with invalid ObjectId
		When I call getBySharerReserverListing with invalid ObjectId that throws error
		Then it should return null due to error handling

	Scenario: Testing getByUser with invalid ObjectId that throws error
		When I call getByUser with ObjectId that throws error
		Then it should return empty array due to error handling

	Scenario: Testing getConversationReadRepository factory function
		When I call getConversationReadRepository factory function
		Then it should return a ConversationReadRepositoryImpl instance
	Scenario: Getting conversation with error in database query
		Given an error will occur during the query
		When I call getBySharerReserverListing
		Then it should return null due to error

	Scenario: Getting conversation with invalid ObjectId format
		Given an invalid ObjectId will cause an error
		When I call getBySharerReserverListing with invalid ID
		Then it should return null due to ObjectId error
