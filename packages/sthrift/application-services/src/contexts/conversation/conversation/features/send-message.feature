Feature: Send Message in Conversation
  As a user
  I want to send messages in a conversation
  So that I can communicate with the other party

  Scenario: Successfully sending a message
    Given a valid conversation exists with ID "conv-123"
    And I am a participant in the conversation with author ID "author-123"
    And the message content is "Hello, I would like to reserve this item."
    When I send the message
    Then the message should be sent successfully
    And the message should be returned with the content and author ID

  Scenario: Sending a message with empty content
    Given a valid conversation exists with ID "conv-123"
    And I am a participant in the conversation with author ID "author-123"
    And the message content is empty
    When I try to send the message
    Then an error should be thrown indicating message content cannot be empty

  Scenario: Sending a message that exceeds character limit
    Given a valid conversation exists with ID "conv-123"
    And I am a participant in the conversation with author ID "author-123"
    And the message content exceeds 2000 characters
    When I try to send the message
    Then an error should be thrown indicating message exceeds maximum length

  Scenario: Sending a message to non-existent conversation
    Given a conversation does not exist with ID "non-existent-conv"
    When I try to send a message to that conversation
    Then an error should be thrown indicating conversation not found

  Scenario: Sending a message when not a participant
    Given a valid conversation exists with ID "conv-123"
    And I am not a participant in the conversation
    When I try to send a message
    Then an error should be thrown indicating not authorized

  Scenario: Handling messaging service unavailable
    Given a valid conversation exists with ID "conv-123"
    And I am a participant in the conversation with author ID "author-123"
    And the messaging data source is unavailable
    When I try to send a message
    Then an error should be thrown indicating messaging service unavailable

  Scenario: Handling messaging service send failure
    Given a valid conversation exists with ID "conv-123"
    And I am a participant in the conversation with author ID "author-123"
    And the messaging service fails to send the message
    When I try to send a message
    Then an error should be thrown with the messaging service error details

  Scenario: Sharer can send message in conversation
    Given a valid conversation exists with sharer ID "sharer-123" and reserver ID "reserver-456"
    And the current user is the sharer with ID "sharer-123"
    When I send a message as the sharer
    Then the message should be sent successfully with author ID "sharer-123"
    And the message should be persisted to the messaging repository

  Scenario: Reserver can send message in conversation
    Given a valid conversation exists with sharer ID "sharer-123" and reserver ID "reserver-456"
    And the current user is the reserver with ID "reserver-456"
    When I send a message as the reserver
    Then the message should be sent successfully with author ID "reserver-456"
    And the message should be persisted to the messaging repository
