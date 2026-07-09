@e2e
Feature: Send Messages

  As a ShareThrift user
  I want to access my conversations
  So that I can coordinate sharing with other members

  Background:
    Given Alice is an authenticated user

  Scenario: Send a message about a listing
    Given Alice has a conversation about "E2E Message Projector"
    When Alice opens her messages
    And Alice sends the message "Is the projector available Saturday?"
    Then Alice should see the sent message "Is the projector available Saturday?"

  Scenario: A sent message remains in the conversation
    Given Alice has a conversation about "E2E Camping Tent"
    When Alice opens her messages
    And Alice sends the message "Could I pick this up after work?"
    And Alice leaves and reopens her messages
    Then Alice should see the sent message "Could I pick this up after work?"
