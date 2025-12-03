Feature: Admin user account entity
  As a system
  I want to validate admin user account entity properties
  So that I can ensure data integrity

  Background:
    Given I have an admin user account props object

  Scenario: Admin user account accountType should be a string
    When I access the accountType property
    Then it should be a string

  Scenario: Admin user account email should be a string
    When I access the email property
    Then it should be a valid email string

  Scenario: Admin user account username should be a string
    When I access the username property
    Then it should be a string

  Scenario: Admin user account profile should be defined
    When I access the profile property
    Then it should be defined
