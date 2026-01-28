Feature: Admin User Account Profile

  Background:
    Given I have a valid user visa
    And I have an admin user aggregate root
    And I have admin user profile props

  Scenario: Getting firstName property
    Given an admin user profile with firstName "John"
    When I access the firstName property
    Then it should return "John"

  Scenario: Getting lastName property
    Given an admin user profile with lastName "Doe"
    When I access the lastName property
    Then it should return "Doe"

  Scenario: Getting aboutMe property
    Given an admin user profile with aboutMe "Test bio"
    When I access the aboutMe property
    Then it should return "Test bio"

  Scenario: Setting firstName with proper permissions
    Given an admin user profile
    And the user is editing their own account
    When I set firstName to "Jane"
    Then the firstName should be updated

  Scenario: Setting firstName without permissions
    Given an admin user profile
    And the user is not editing their own account
    When I attempt to set firstName
    Then a permission error should be thrown

  Scenario: Getting location property
    Given an admin user profile
    When I access the location property
    Then it should return an AdminUserAccountProfileLocation instance
