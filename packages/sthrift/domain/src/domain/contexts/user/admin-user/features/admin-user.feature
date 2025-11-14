Feature: AdminUser Aggregate Operations

  Background:
    Given a valid Passport with admin permissions
    And a valid UserVisa allowing account creation and self-editing
    And base admin user properties with email "admin@example.com", firstName "Admin", lastName "User"

  Scenario: Creating a new admin user instance
    When I create a new AdminUser aggregate using getNewInstance
    Then it should have correct email "admin@example.com"
    And username should be "adminuser"
    And firstName should be "Admin"
    And lastName should be "User"
    And isNew should be false after creation
    And it should expose a valid AdminUserAccount instance

  Scenario: Updating userType with valid permission
    Given an existing AdminUser aggregate
    And the user has permission to edit their account
    When I set userType to "SuperAdmin"
    Then userType should update successfully

  Scenario: Blocking an admin user without permission
    Given an existing AdminUser aggregate
    And the user lacks permission to block users
    When I attempt to set isBlocked to true
    Then it should throw a PermissionError

  Scenario: Changing admin user role with permission
    Given an existing AdminUser aggregate
    And the user has permission to manage user roles
    When I access the role property
    Then it should return the current role

  Scenario: Attempting to change role without permission
    Given an existing AdminUser aggregate
    And the user lacks permission to manage user roles
    When I attempt to change the role property
    Then it should throw a PermissionError
