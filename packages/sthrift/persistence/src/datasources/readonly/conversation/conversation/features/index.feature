Feature: ConversationReadRepositoryImpl Conversation Read Repository Implementation

	Background:
		Given a valid models context with Conversation model
		And a valid passport for domain operations

	Scenario: Creating Conversation Read Repository Implementation
		When I call ConversationReadRepositoryImpl with models and passport
		Then I should receive an object with ConversationReadRepo property
		And the ConversationReadRepo should be a ConversationReadRepository instance

	Scenario: ConversationReadRepositoryImpl exports
		Then ConversationReadRepositoryImpl should be exported from index
		And ConversationReadRepositoryImpl should be a function
		And ConversationReadRepository type should be exported from index
