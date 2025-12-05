Feature: UserReadRepository
  As a consumer of the UserReadRepository
  I want to retrieve users by ID and email, supporting both personal and admin users
  So that I can access user data in a unified way

  Background:
    Given a UserReadRepository instance with working data sources and passport
    And valid PersonalUser and AdminUser documents exist in the database

  Scenario: Getting a user by ID (personal)
    When I call getById with a personal user ID
    Then I should receive a PersonalUser domain object

  Scenario: Getting a user by ID (admin)
    When I call getById with an admin user ID
    Then I should receive an AdminUser domain object

  Scenario: Getting a user by ID that does not exist
    When I call getById with a non-existent user ID
    Then I should receive null

  Scenario: Getting a user by email (personal)
    When I call getByEmail with a personal user email
    Then I should receive a PersonalUser domain object

  Scenario: Getting a user by email (admin)
    When I call getByEmail with an admin user email
    Then I should receive an AdminUser domain object

  Scenario: Getting a user by email that does not exist
    When I call getByEmail with a non-existent user email
    Then I should receive null
