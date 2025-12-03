Feature: Admin User Account

  Background:
    Given I have a valid user visa
    And I have an admin user aggregate root
    And I have admin user account props

  Scenario: Getting accountType property
    Given an admin user account with accountType "admin"
    When I access the accountType property
    Then it should return "admin"

  Scenario: Getting email property
    Given an admin user account with email "test@example.com"
    When I access the email property
    Then it should return "test@example.com"

  Scenario: Getting username property
    Given an admin user account with username "testuser"
    When I access the username property
    Then it should return "testuser"

  Scenario: Setting accountType with proper permissions
    Given an admin user account
    And the user is editing their own account
    When I set accountType to "superadmin"
    Then the accountType should be updated

  Scenario: Setting accountType without permissions
    Given an admin user account
    And the user is not editing their own account
    When I attempt to set accountType
    Then a permission error should be thrown

  Scenario: Getting profile property
    Given an admin user account
    When I access the profile property
    Then it should return an AdminUserProfile instance
