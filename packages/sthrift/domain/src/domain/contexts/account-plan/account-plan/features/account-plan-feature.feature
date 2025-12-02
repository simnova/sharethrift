

Feature: AccountPlanFeature value object

  Background:
    Given base account plan feature properties

  Scenario: Setting properties without permission throws
    Given an AccountPlanFeature with no permissions
    When I attempt to set activeReservations
    Then it should throw a PermissionError for activeReservations
    When I attempt to set bookmarks
    Then it should throw a PermissionError for bookmarks
    When I attempt to set itemsToShare
    Then it should throw a PermissionError for itemsToShare
    When I attempt to set friends
    Then it should throw a PermissionError for friends

  Scenario: Creating a new AccountPlanFeature instance
    When I create a new AccountPlanFeature
    Then it should have correct activeReservations
    Then it should have correct bookmarks
    Then it should have correct itemsToShare
    Then it should have correct friends

  Scenario: Updating feature properties
    When I set activeReservations to 10
    Then activeReservations should be 10
    When I set bookmarks to 20
    Then bookmarks should be 20
    When I set itemsToShare to 30
    Then itemsToShare should be 30
    When I set friends to 40
    Then friends should be 40

  Scenario: Getting all properties
    Then all properties should return correct values
