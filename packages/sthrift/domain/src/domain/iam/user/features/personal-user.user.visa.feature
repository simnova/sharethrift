Feature: <Visa> PersonalUserUserVisa

  Background:
    Given a valid PersonalUserEntityReference with id "user-1"
    And a valid root PersonalUserEntityReference with id "root-1"

  Scenario: Creating a PersonalUserUserVisa with root and user
    When I create a PersonalUserUserVisa with the root and user
    Then the visa should be created successfully

  Scenario: determineIf returns true when the permission function returns true
    Given a PersonalUserUserVisa for the root and user
    When I call determineIf with a function that returns true if isEditingOwnAccount is false
    Then the result should be true

  Scenario: determineIf returns false when the permission function returns false
    Given a PersonalUserUserVisa for the root and user
    When I call determineIf with a function that always returns false
    Then the result should be false

  Scenario: determineIf sets isEditingOwnAccount to true when the root and user have the same id
    Given a PersonalUserEntityReference root with id "same-id"
    And a PersonalUserEntityReference user with id "same-id"
    When I create a PersonalUserUserVisa with the root and user
    And I call determineIf with a function that returns isEditingOwnAccount
    Then the result should be true

  Scenario: determineIf sets isEditingOwnAccount to false when the root and user have different ids
    Given a PersonalUserEntityReference root with id "root-1"
    And a PersonalUserEntityReference user with id "user-2"
    When I create a PersonalUserUserVisa with the root and user
    And I call determineIf with a function that returns isEditingOwnAccount
    Then the result should be false

  Scenario: determineIf sets all other permissions to false
    Given a PersonalUserUserVisa for the root and user
    When I call determineIf with a function that checks all permission flags
    Then all permission flags except isEditingOwnAccount and isSystemAccount should be false

  Scenario: determineIf sets isSystemAccount to false
    Given a PersonalUserUserVisa for the root and user
    When I call determineIf with a function that returns isSystemAccount
    Then the result should be false
 