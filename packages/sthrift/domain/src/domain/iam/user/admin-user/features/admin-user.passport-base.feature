Feature: Admin user passport base
  As a system
  I want to validate admin user passport base functionality
  So that I can ensure passport pattern works correctly

  Scenario: AdminUserPassportBase should be defined
    Given I have the AdminUserPassportBase class
    When I check the class type
    Then it should be defined

  Scenario: AdminUserPassportBase should accept a user entity
    Given I have an admin user entity
    When I create an AdminUserPassportBase instance
    Then it should store the user entity
