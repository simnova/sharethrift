Feature: ListingAppealRequest entity

  Background:
    Given a valid listing appeal request with user, listing, and blocker

  Scenario: Creating a new listing appeal request entity
    When I create a new ListingAppealRequest entity
    Then the entity should have the correct user reference
    And the entity should have the correct listing reference
    And the entity should have the correct reason
    And the entity should have the correct state
    And the entity should have the correct type
    And the entity should have the correct blocker reference

  Scenario: Getting user property
    Given a ListingAppealRequest entity
    When I get the user property
    Then it should return the correct user reference

  Scenario: Getting listing property
    Given a ListingAppealRequest entity
    When I get the listing property
    Then it should return the correct listing reference

  Scenario: Getting blocker property
    Given a ListingAppealRequest entity
    When I get the blocker property
    Then it should return the correct blocker reference

  Scenario: Getting reason property
    Given a ListingAppealRequest entity
    When I get the reason property
    Then it should return the correct reason

  Scenario: Getting state property
    Given a ListingAppealRequest entity
    When I get the state property
    Then it should return the correct state

  Scenario: Getting type property
    Given a ListingAppealRequest entity
    When I get the type property
    Then it should return the correct type

  Scenario: Getting createdAt property
    Given a ListingAppealRequest entity
    When I get the createdAt property
    Then it should return the correct creation date

  Scenario: Getting updatedAt property
    Given a ListingAppealRequest entity
    When I get the updatedAt property
    Then it should return the correct update date

  Scenario: Getting schemaVersion property
    Given a ListingAppealRequest entity
    When I get the schemaVersion property
    Then it should return the correct schema version

  Scenario: Entity properties are readonly
    Given a ListingAppealRequest entity
    Then all properties should be readonly and not modifiable
