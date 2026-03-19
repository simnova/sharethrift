Feature: AdminUser Repository Operations

  Background:
    Given an AdminUserRepository instance with a working Mongoose model, type converter, and passport
    And valid AdminUser documents exist in the database

  Scenario: Getting an admin user by ID
    Given an AdminUser document with id "admin-user-1", email "admin@example.com", and firstName "Admin"
    When I call getById with "admin-user-1"
    Then I should receive an AdminUser domain object
    And the domain object's email should be "admin@example.com"
    And the domain object's firstName should be "Admin"

  Scenario: Getting an admin user by a nonexistent ID
    When I call getById with "nonexistent-id"
    Then an error should be thrown indicating "User with id nonexistent-id not found"

  Scenario: Creating a new admin user instance
    When I call getNewInstance with email "newadmin@example.com", username "newadmin", firstName "New", and lastName "Admin"
    Then I should receive a new AdminUser domain object
    And the domain object's email should be "newadmin@example.com"
    And the domain object's firstName should be "New"
    And the domain object's lastName should be "Admin"
