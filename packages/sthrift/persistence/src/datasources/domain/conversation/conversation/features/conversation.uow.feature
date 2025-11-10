Feature: ConversationUnitOfWork

Background:
  Given the system is configured with Mongoose, EventBus, and domain adapters

Scenario: Initialize a ConversationUnitOfWork successfully
  Given a valid Mongoose Conversation model
  And a valid Passport instance
  When I call getConversationUnitOfWork with the model and passport
  Then I should receive a ConversationUnitOfWork instance
  And the unit of work should have a repository property
  And the repository should be an instance of ConversationRepository

Scenario: ConversationUnitOfWork should support standard UnitOfWork operations
  Given an initialized ConversationUnitOfWork
  When I access the repository property
  Then I should be able to call repository methods like getById, getByTwilioSid, etc.
  And the repository should be properly configured with the model and passport
