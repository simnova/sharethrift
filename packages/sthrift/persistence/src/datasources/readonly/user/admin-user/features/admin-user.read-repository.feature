Feature: AdminUser Read Repository Operations

  Background:
    Given an AdminUserReadRepository instance with a working data source and passport
    And valid AdminUser documents exist in the database

  Scenario: Getting all admin users
    When I call getAll
    Then I should receive an array of AdminUser domain objects

  Scenario: Getting all users with pagination
    Given multiple AdminUser documents exist in the database
    When I call getAllUsers with page 1 and pageSize 10
    Then I should receive a paginated result with items, total, page, and pageSize

  Scenario: Getting all users with search text
    Given AdminUser documents with various emails and names
    When I call getAllUsers with searchText "admin1"
    Then I should receive only users matching the search text

  Scenario: Getting all users with status filters
    Given AdminUser documents with different statuses
    When I call getAllUsers with statusFilters including "Active"
    Then I should receive only active users

  Scenario: Getting an admin user by ID
    Given an AdminUser document with id "admin-user-1"
    When I call getById with "admin-user-1"
    Then I should receive an AdminUser domain object with that ID

  Scenario: Getting an admin user by ID that doesn't exist
    When I call getById with "nonexistent-id"
    Then I should receive null

  Scenario: Getting an admin user by email
    Given an AdminUser document with email "admin@example.com"
    When I call getByEmail with "admin@example.com"
    Then I should receive an AdminUser domain object with that email

  Scenario: Getting an admin user by email that doesn't exist
    When I call getByEmail with "nonexistent@example.com"
    Then I should receive null
