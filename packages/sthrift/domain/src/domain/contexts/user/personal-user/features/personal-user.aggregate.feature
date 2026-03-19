Feature: <AggregateRoot> PersonalUser
 
  Background:
    Given a valid Passport with user permissions
    And a valid UserVisa allowing account creation and self-editing
    And base user properties with email "john@example.com", firstName "John", lastName "Doe"

  Scenario: Creating a new personal user instance
    When I create a new PersonalUser aggregate using getNewInstance
    Then it should have correct email "john@example.com"
    And firstName should be "John"
    And lastName should be "Doe"
    And isNew should be false after creation
    And it should expose a valid PersonalUserAccount instance

  Scenario: Updating userType with valid permission
    Given an existing PersonalUser aggregate
    And the user has permission to edit their account
    When I set userType to "Sharer"
    Then userType should update successfully

  Scenario: Blocking a user without permission
    Given an existing PersonalUser aggregate
    And the user lacks permission to edit their account
    When I attempt to set isBlocked to true
    Then it should throw a PermissionError

  Scenario: Completing onboarding
    Given a PersonalUser that has not completed onboarding
    When I set hasCompletedOnboarding to true
    Then the property should update successfully

  Scenario: Attempting to complete onboarding twice
    Given a PersonalUser that has already completed onboarding
    When I set hasCompletedOnboarding to true again
    Then it should throw a PermissionError

  Scenario: Blocking a user with permission
    Given an existing PersonalUser aggregate
    And the user has permission to block users
    When I set isBlocked to true
    Then isBlocked should be true

  Scenario: Unblocking a user with permission
    Given an existing PersonalUser aggregate that is blocked
    And the user has permission to block users
    When I set isBlocked to false
    Then isBlocked should be false

  Scenario: Getting isNew from personal user
    Given an existing PersonalUser aggregate
    When I access the isNew property
    Then it should return false

  Scenario: Getting schemaVersion from personal user
    Given an existing PersonalUser aggregate
    When I access the schemaVersion property
    Then it should return the schema version

  Scenario: Getting createdAt from personal user
    Given an existing PersonalUser aggregate
    When I access the createdAt property
    Then it should return a valid date

  Scenario: Getting updatedAt from personal user
    Given an existing PersonalUser aggregate
    When I access the updatedAt property
    Then it should return a valid date

  Scenario: Adding a billing transaction
    Given an existing PersonalUser aggregate
    And the user has permission to edit their account
    When I add a billing transaction with valid data
    Then the transaction should be added successfully

  Scenario: Adding a billing transaction with error message
    Given an existing PersonalUser aggregate
    And the user has permission to edit their account
    When I add a billing transaction with an error message
    Then the transaction should be added with the error message

  Scenario: Updating userType without permission
    Given an existing PersonalUser aggregate without editing permission
    When I attempt to set userType to "Sharer"
    Then it should throw a PermissionError with message "Unauthorized to modify user"