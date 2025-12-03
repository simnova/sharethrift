Feature: Query Conversation By ID

  Scenario: Successfully retrieving conversation with messaging messages
    Given a valid conversation ID "conv-123"
    And the conversation exists with messaging conversation ID
    And messaging messages are available
    When the queryById command is executed
    Then the conversation should be returned
    And the conversation should include messaging messages

  Scenario: Retrieving conversation when messaging service fails
    Given a valid conversation ID "conv-123"
    And the conversation exists
    And the messaging service fails to retrieve messages
    When the queryById command is executed
    Then the conversation should be returned without messages
    And a warning should be logged

  Scenario: Handling non-existent conversation
    Given a non-existent conversation ID "invalid-id"
    When the queryById command is executed
    Then null should be returned
