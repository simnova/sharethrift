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

  Scenario: Blocking an admin user with permission
    Given an existing AdminUser aggregate
    And the user has permission to block users
    When I set isBlocked to true
    Then isBlocked should be true

  Scenario: Unblocking an admin user with permission
    Given an existing AdminUser aggregate that is blocked
    And the user has permission to block users
    When I set isBlocked to false
    Then isBlocked should be false

  Scenario: Loading role asynchronously
    Given an existing AdminUser aggregate
    When I call loadRole
    Then it should return the role asynchronously

  Scenario: Attempting to set role to null
    Given a new AdminUser aggregate
    When I attempt to set role to null
    Then it should throw a PermissionError with message "role cannot be null or undefined"

  Scenario: Attempting to set role to undefined
    Given a new AdminUser aggregate
    When I attempt to set role to undefined
    Then it should throw a PermissionError with message "role cannot be null or undefined"

  Scenario: Getting createdAt from admin user
    Given an existing AdminUser aggregate
    When I access the createdAt property
    Then it should return a valid date

  Scenario: Getting updatedAt from admin user
    Given an existing AdminUser aggregate
    When I access the updatedAt property
    Then it should return a valid date
