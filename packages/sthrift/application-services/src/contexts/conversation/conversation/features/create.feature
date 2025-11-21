Feature: Create Conversation

  Scenario: Successfully creating a new conversation
    Given valid sharer ID "sharer-123", reserver ID "reserver-456", and listing ID "listing-789"
    And all entities exist in the database
    And no existing conversation exists for these entities
    When the create command is executed
    Then a messaging conversation should be created
    And a domain conversation should be created and saved
    And the conversation should be returned with the messaging conversation ID

  Scenario: Returning existing conversation
    Given valid sharer ID "sharer-123", reserver ID "reserver-456", and listing ID "listing-789"
    And an existing conversation already exists for these entities
    When the create command is executed
    Then the existing conversation should be returned
    And no new conversation should be created

  Scenario: Handling missing sharer
    Given a non-existent sharer ID "invalid-sharer"
    When the create command is executed
    Then an error should be thrown indicating sharer not found

  Scenario: Handling missing reserver
    Given a non-existent reserver ID "invalid-reserver"
    When the create command is executed
    Then an error should be thrown indicating reserver not found

  Scenario: Handling missing listing
    Given a non-existent listing ID "invalid-listing"
    When the create command is executed
    Then an error should be thrown indicating listing not found

  Scenario: Handling messaging service unavailable
    Given valid entities
    And the messaging data source is unavailable
    When the create command is executed
    Then an error should be thrown indicating messaging service unavailable

  Scenario: Handling messaging service creation failure
    Given valid entities
    And the messaging data source is available
    And the messaging service fails to create a conversation
    When the create command is executed
    Then an error should be thrown with the messaging service error details
