Feature: AccountPlan aggregate
  Background:
    Given a valid Passport with account plan permissions
    And base account plan properties

  Scenario: Creating a new account plan instance
    When I create a new AccountPlan aggregate using getNewInstance
    Then it should have correct name "Pro"
    And description should be "Pro plan"
    And it should expose a valid feature object

  Scenario: Updating name with valid permission
    When I set name to "Basic"
    Then name should update successfully

  Scenario: Updating name without permission throws
    Given a plan with no update permission
    When I attempt to set name
    Then it should throw a PermissionError

  Scenario: Updating feature properties
    When I set feature.activeReservations to 10
    Then feature.activeReservations should be 10

  Scenario: Getting all properties
    Then all properties should return correct values

  Scenario: Updating status with valid permission
    When I set status to "INACTIVE"
    Then status should be "INACTIVE"

  Scenario: Updating cybersourcePlanId with valid permission
    When I set cybersourcePlanId to "new-cs-456"
    Then cybersourcePlanId should be "new-cs-456"
