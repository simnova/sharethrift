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

  Scenario: Processing conversations for archived listings through the application service
    Given a conversation application service
    When I process conversations for archived listings
    Then it should delegate to the cleanup function

  Scenario: Processing conversations for archived reservation requests through the application service
    Given a conversation application service
    When I process conversations for archived reservation requests
    Then it should delegate to the cleanup function
