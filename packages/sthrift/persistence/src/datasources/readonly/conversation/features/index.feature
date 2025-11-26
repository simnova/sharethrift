Feature: <Index> Readonly Conversation Context Index Exports

	Scenario: Exports from readonly conversation context index
		Then the ConversationContext function should be exported
		And ConversationContext should be a function

	Scenario: Calling ConversationContext returns repository
		Given a models context and passport
		When I call ConversationContext
		Then it should return an object with Conversation property
