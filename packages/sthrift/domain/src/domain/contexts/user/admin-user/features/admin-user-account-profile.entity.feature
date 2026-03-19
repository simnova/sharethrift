Feature: Admin user account profile entity
  As a system
  I want to validate admin user account profile entity properties
  So that I can ensure data integrity

  Background:
    Given I have an admin user account profile props object

  Scenario: Admin user account profile firstName should be a string
    When I access the firstName property
    Then it should be a string

  Scenario: Admin user account profile lastName should be a string
    When I access the lastName property
    Then it should be a string

  Scenario: Admin user account profile aboutMe should be a string
    When I access the aboutMe property
    Then it should be a string

  Scenario: Admin user account profile location should be defined
    When I access the location property
    Then it should be defined
