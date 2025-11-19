Feature: UserAppealRequest entity

  Background:
    Given a valid user appeal request with user and blocker

  Scenario: Creating a new user appeal request entity
    When I create a new UserAppealRequest entity
    Then the entity should have the correct user reference
    And the entity should have the correct reason
    And the entity should have the correct state
    And the entity should have the correct type
    And the entity should have the correct blocker reference

  Scenario: Getting user property
    Given a UserAppealRequest entity
    When I get the user property
    Then it should return the correct user reference

  Scenario: Entity properties are readonly
    Given a UserAppealRequest entity
    Then all properties should be readonly and not modifiable
