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
