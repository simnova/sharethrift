Feature: Query Conversations By User

  Scenario: Successfully retrieving user's conversations with messages
    Given a valid user ID "user-123"
    And the user has 2 conversations
    And messaging messages are available for all conversations
    When the queryByUser command is executed
    Then all conversations should be returned
    And each conversation should include messaging messages

  Scenario: Retrieving conversations when messaging service partially fails
    Given a valid user ID "user-123"
    And the user has 2 conversations
    And messaging service fails for one conversation
    When the queryByUser command is executed
    Then all conversations should be returned
    And the failed conversation should return without messages

  Scenario: Handling user with no conversations
    Given a valid user ID "user-456"
    And the user has no conversations
    When the queryByUser command is executed
    Then an empty array should be returned
