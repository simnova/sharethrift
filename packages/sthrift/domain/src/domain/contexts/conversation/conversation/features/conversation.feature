
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
    And the schemaVersion property should return the correct value

  Scenario: Setting listing to null
    Given a Conversation aggregate with permission to manage conversation
    When I try to set the listing to null
    Then a PermissionError should be thrown with message "listing cannot be null or undefined"

  Scenario: Setting listing to undefined
    Given a Conversation aggregate with permission to manage conversation
    When I try to set the listing to undefined
    Then a PermissionError should be thrown with message "listing cannot be null or undefined"

  Scenario: Getting messages from conversation
    Given a Conversation aggregate with messages
    When I access the messages property
    Then it should return an array of messages

  Scenario: Loading listing asynchronously
    Given a Conversation aggregate
    When I call loadListing()
    Then it should return the listing asynchronously

  Scenario: Setting reserver to null
    Given a Conversation aggregate with permission to manage conversation
    When I try to set the reserver to null
    Then a PermissionError should be thrown with message "reserver cannot be null or undefined"

  Scenario: Setting reserver to undefined
    Given a Conversation aggregate with permission to manage conversation
    When I try to set the reserver to undefined
    Then a PermissionError should be thrown with message "reserver cannot be null or undefined"

  Scenario: Setting sharer to null
    Given a Conversation aggregate with permission to manage conversation
    When I try to set the sharer to null
    Then a PermissionError should be thrown with message "sharer cannot be null or undefined"

  Scenario: Setting sharer to undefined
    Given a Conversation aggregate with permission to manage conversation
    When I try to set the sharer to undefined
    Then a PermissionError should be thrown with message "sharer cannot be null or undefined"

  Scenario: Loading messages asynchronously
    Given a Conversation aggregate
    When I call loadMessages()
    Then it should return the messages asynchronously

  Scenario: Getting reserver when userType is admin-user
    Given a Conversation aggregate with an admin-user reserver
    When I access the reserver property
    Then it should return an AdminUser instance

  Scenario: Setting reserver without permission
    Given a Conversation aggregate without permission to manage conversation
    When I try to set the reserver
    Then a PermissionError should be thrown about managing conversation

  Scenario: Getting sharer when userType is admin-user
    Given a Conversation aggregate with an admin-user sharer
    When I access the sharer property
    Then it should return an AdminUser instance for the sharer

  Scenario: Loading sharer asynchronously
    Given a Conversation aggregate
    When I call loadSharer()
    Then it should return the sharer asynchronously

  Scenario: Loading reserver asynchronously
    Given a Conversation aggregate
    When I call loadReserver()
    Then it should return the reserver asynchronously

  Scenario: Getting expiresAt when not set
    Given a Conversation aggregate without an expiration date
    When I access the expiresAt property
    Then it should return undefined

  Scenario: Setting expiresAt with permission
    Given a Conversation aggregate with permission to manage conversation
    When I set the expiresAt to a future date
    Then the expiresAt should be updated to that date

  Scenario: Setting expiresAt without permission
    Given a Conversation aggregate without permission to manage conversation
    When I try to set the expiresAt to a future date
    Then a PermissionError should be thrown

  Scenario: Scheduling a conversation for deletion with permission
    Given a Conversation aggregate with permission to manage conversation
    When I call scheduleForDeletion with a retention period
    Then the expiresAt should be set to current date plus retention period

  Scenario: Scheduling a conversation for deletion without permission
    Given a Conversation aggregate without permission to manage conversation
    When I try to call scheduleForDeletion
    Then a PermissionError should be thrown

  Scenario: Getting reservation request when it exists
    Given a Conversation aggregate with a reservation request
    When I get the reservationRequest property
    Then it should return the reservation request entity reference

  Scenario: Getting reservation request when it doesn't exist
    Given a Conversation aggregate without a reservation request
    When I get the reservationRequest property
    Then it should return undefined

  Scenario: Loading reservation request when loader exists
    Given a Conversation aggregate with a reservation request loader
    When I call loadReservationRequest
    Then it should return the loaded reservation request entity reference

  Scenario: Loading reservation request when loader doesn't exist
    Given a Conversation aggregate without a reservation request loader
    When I call loadReservationRequest
    Then it should return undefined
