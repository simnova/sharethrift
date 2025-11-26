Feature: Admin user account profile location entity
  As a system
  I want to validate admin user account profile location entity properties
  So that I can ensure data integrity

  Background:
    Given I have an admin user account profile location props object

  Scenario: Admin user account profile location address1 should be a string
    When I access the address1 property
    Then it should be a string

  Scenario: Admin user account profile location address2 should be nullable string
    When I access the address2 property
    Then it should be a string or null

  Scenario: Admin user account profile location city should be a string
    When I access the city property
    Then it should be a string

  Scenario: Admin user account profile location state should be a string
    When I access the state property
    Then it should be a string

  Scenario: Admin user account profile location country should be a string
    When I access the country property
    Then it should be a string

  Scenario: Admin user account profile location zipCode should be a string
    When I access the zipCode property
    Then it should be a string
