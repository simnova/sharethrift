Feature: <Index> Messaging Conversation Context Index Exports

	Scenario: Exports from messaging conversation context index
		Then the MessagingConversationContext function should be exported
		And MessagingConversationContext should be a function
		And MessagingConversationRepository type should be exported

	Scenario: Creating Messaging Conversation Context
		Given a mock MessagingService
		And a mock Passport
		When I call MessagingConversationContext with service and passport
		Then it should return an object with Conversation property
