Feature: ConversationUnitOfWork

Background:
Given a Mongoose context factory with a working service
And a valid Conversation model from the models context
And a valid passport for domain operations

	Scenario: Creating a Conversation Unit of Work
		When I call getConversationUnitOfWork with the Conversation model and passport
		Then I should receive a properly initialized ConversationUnitOfWork
		And the Unit of Work should have the correct methods
