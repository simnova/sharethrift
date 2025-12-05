Feature: Admin user entity
  As a system
  I want to validate admin user entity properties
  So that I can ensure data integrity

  Background:
    Given I have an admin user props object

  Scenario: Admin user userType should be a string
    When I access the userType property
    Then it should be a string

  Scenario: Admin user isBlocked should be a boolean
    When I access the isBlocked property
    Then it should be a boolean

  Scenario: Admin user role reference should be readonly
    When I attempt to modify the role property
    Then it should remain unchanged

  Scenario: Admin user account should be defined
    When I access the account property
    Then it should be defined

  Scenario: Admin user schemaVersion should be defined
    When I access the schemaVersion property
    Then it should be a string

  Scenario: Admin user timestamps should be valid dates
    When I access the createdAt and updatedAt properties
    Then they should be valid Date objects
