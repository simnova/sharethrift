Feature: ConversationPersistence Conversation Domain Persistence

	Background:
		Given a valid models context with Conversation model
		And a valid passport for domain operations

	Scenario: Creating Conversation Persistence
		When I call ConversationPersistence with models and passport
		Then I should receive an object with ConversationUnitOfWork property
		And the ConversationUnitOfWork should be properly initialized

	Scenario: ConversationPersistence exports
		Then ConversationPersistence should be exported from index
		And ConversationPersistence should be a function
