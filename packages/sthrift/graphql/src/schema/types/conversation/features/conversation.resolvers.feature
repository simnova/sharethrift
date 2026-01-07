Feature: Conversation Resolvers

As an API consumer
I want to query and mutate conversation entities
So that I can retrieve and create conversations through the GraphQL API

  Scenario: Querying conversations by user ID
		When the conversationsByUser query is executed with that ID
		Then it should return a list of Conversation entities

	Scenario: Querying conversations by user ID with no conversations
		When the conversationsByUser query is executed
		Then it should return an empty list

	Scenario: Querying conversations by user ID when an error occurs
		When the conversationsByUser query is executed
		Then it should propagate the error message

	Scenario: Querying a conversation by ID
		Given a valid conversation ID
		When the conversation query is executed with that ID
		Then it should call Conversation.Conversation.queryById with the provided conversationId
		And it should return the corresponding Conversation entity

	Scenario: Querying a conversation by ID that does not exist
		Given a conversation ID that does not match any record
		When the conversation query is executed
		Then it should return null

	Scenario: Querying a conversation by ID when an error occurs
		Given a valid conversation ID
		And Conversation.Conversation.queryById throws an error
		When the conversation query is executed
		Then it should propagate the error message

	Scenario: Creating a conversation
		Given a valid ConversationCreateInput with sharerId, reserverId, and listingId
		When the createConversation mutation is executed with that input
		Then it should call Conversation.Conversation.create with the provided input fields
		And it should return a ConversationMutationResult with success true and the created conversation

	Scenario: Creating a conversation when Conversation.Conversation.create throws an error
		Given a valid ConversationCreateInput
		And Conversation.Conversation.create throws an error
		When the createConversation mutation is executed
		Then it should return a ConversationMutationResult with success false and the error message

	Scenario: Sending a message in a conversation
		Given a valid SendMessageInput with conversationId and content
		When the sendMessage mutation is executed with that input
		Then it should call Conversation.Conversation.sendMessage with authorId derived from authenticated user
		And it should return a SendMessageMutationResult with success true and the sent message

	Scenario: Sending a message when Conversation.Conversation.sendMessage throws an error
		Given a valid SendMessageInput
		And Conversation.Conversation.sendMessage throws an error
		When the sendMessage mutation is executed
		Then it should return a SendMessageMutationResult with success false and the error message