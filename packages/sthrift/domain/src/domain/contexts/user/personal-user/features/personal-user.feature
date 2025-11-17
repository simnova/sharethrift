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
    And it should expose a valid PersonalUserRole instance

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