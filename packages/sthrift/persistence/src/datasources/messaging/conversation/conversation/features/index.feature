Feature: MessagingConversationRepositoryImpl Messaging Conversation Repository Implementation

	Background:
		Given a valid messaging service
		And a valid passport for domain operations

	Scenario: Creating Messaging Conversation Repository Implementation
		When I call MessagingConversationRepositoryImpl with messaging service and passport
		Then I should receive an object with MessagingConversationRepo property
		And the MessagingConversationRepo should be a MessagingConversationRepository instance

	Scenario: MessagingConversationRepositoryImpl exports
		Then MessagingConversationRepositoryImpl should be exported from index
		And MessagingConversationRepositoryImpl should be a function
		And MessagingConversationRepository type should be exported from index
