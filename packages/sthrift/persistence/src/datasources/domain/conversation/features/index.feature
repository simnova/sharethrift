Feature: <Index> Conversation Context Index Exports

	Scenario: Exports from conversation context index
		Then the ConversationContextPersistence function should be exported
		And ConversationContextPersistence should be a function

	Scenario: Creating Conversation Context Persistence
		Given a mock ModelsContext with Conversation models
		And a mock Passport
		When I call ConversationContextPersistence with models and passport
		Then it should return an object with Conversation property
