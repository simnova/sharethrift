Feature: Conversation Application Service

  Scenario: Creating a conversation through the application service
    Given a conversation application service
    When I create a conversation
    Then it should delegate to the create function

  Scenario: Querying a conversation by ID through the application service
    Given a conversation application service
    When I query for conversation with id "conv-123"
    Then it should delegate to the queryById function

  Scenario: Querying conversations by user through the application service
    Given a conversation application service
    When I query for conversations by user "user-1"
    Then it should delegate to the queryByUser function
