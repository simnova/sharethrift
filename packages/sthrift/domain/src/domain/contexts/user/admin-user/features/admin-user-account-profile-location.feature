Feature: Admin User Account Profile Location

  Background:
    Given I have a valid user visa
    And I have an admin user aggregate root
    And I have admin user location props

  Scenario: Getting address1 property
    Given an admin user location with address1 "123 Main St"
    When I access the address1 property
    Then it should return "123 Main St"

  Scenario: Getting city property
    Given an admin user location with city "New York"
    When I access the city property
    Then it should return "New York"

  Scenario: Getting state property
    Given an admin user location with state "NY"
    When I access the state property
    Then it should return "NY"

  Scenario: Getting country property
    Given an admin user location with country "USA"
    When I access the country property
    Then it should return "USA"

  Scenario: Getting zipCode property
    Given an admin user location with zipCode "10001"
    When I access the zipCode property
    Then it should return "10001"

  Scenario: Setting address1 with proper permissions
    Given an admin user location
    And the user is editing their own account
    When I set address1 to "456 Elm St"
    Then the address1 should be updated

  Scenario: Setting location fields without permissions
    Given an admin user location
    And the user is not editing their own account
    When I attempt to set address1
    Then a permission error should be thrown
