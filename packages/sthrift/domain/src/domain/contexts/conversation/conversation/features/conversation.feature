
Feature: Conversation aggregate

  Scenario: Setting the messagingConversationId with permission
    Given a Conversation aggregate with permission to manage conversation
    When I set the messagingConversationId to a new value
    Then the messagingConversationId should be updated

  Scenario: Setting the messagingConversationId without permission
    Given a Conversation aggregate without permission to manage conversation
    When I try to set the messagingConversationId to a new value
    Then a PermissionError should be thrown

  Background:
    Given a valid Passport with conversation permissions
    And base conversation properties with valid users and listing

  Scenario: Creating a new conversation instance
    When I create a new Conversation aggregate using getNewInstance
    Then the conversation should have the correct sharer, reserver, and listing
    Then the conversation should have a messagingConversationId

  Scenario: Changing the sharer with permission
    Given a Conversation aggregate with permission to manage conversation
    When I set the sharer to a new user
    Then the conversation's sharer should be updated

  Scenario: Changing the sharer without permission
    Given a Conversation aggregate without permission to manage conversation
    When I try to set the sharer to a new user
    Then a PermissionError should be thrown

  Scenario: Changing the reserver with permission
    Given a Conversation aggregate with permission to manage conversation
    When I set the reserver to a new user
    Then the conversation's reserver should be updated

  Scenario: Changing the reserver without permission
    Given a Conversation aggregate without permission to manage conversation
    When I try to set the reserver to a new user
    Then a PermissionError should be thrown

  Scenario: Changing the listing with permission
    Given a Conversation aggregate with permission to manage conversation
    When I set the listing to a new item listing
    Then the conversation's listing should be updated

  Scenario: Changing the listing without permission
    Given a Conversation aggregate without permission to manage conversation
    When I try to set the listing to a new item listing
    Then a PermissionError should be thrown

  Scenario: Getting readonly properties
    Given a Conversation aggregate
    Then the messagingConversationId property should return the correct value
    And the createdAt property should return the correct date
    And the updatedAt property should return the correct date
