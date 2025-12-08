Feature: User Union Resolvers

  Background:
    Given a GraphQL context with application services

  Scenario: Query currentUser returns authenticated user
    Given a verified admin user is authenticated
    When currentUser query is called
    Then it should return the authenticated user

  Scenario: Query currentUser throws error when not authenticated
    Given no user is authenticated
    When currentUser query is called
    Then it should throw "Unauthorized: Authentication required"

  Scenario: Query currentUser throws error when user not found
    Given a verified user is authenticated but not in database
    When currentUser query is called
    Then it should throw "User not found"

  Scenario: Query userById returns AdminUser
    When userById query is called with an admin user ID
    Then it should return the AdminUser entity

  Scenario: Query userById returns PersonalUser
    When userById query is called with a personal user ID
    Then it should return the PersonalUser entity

  Scenario: Query userById returns null when user not found
    When userById query is called with a non-existent ID
    Then it should return null

  Scenario: Query allSystemUsers returns all users for admin
    Given an authenticated admin with canViewAllUsers permission
    When allSystemUsers query is called
    Then it should return both personal and admin users

  Scenario: Query allSystemUsers filters by user type
    Given an authenticated admin with canViewAllUsers permission
    When allSystemUsers query is called with personal user type filter
    Then it should return only personal users

  Scenario: Query allSystemUsers throws error without permission
    Given an authenticated admin without canViewAllUsers permission
    When allSystemUsers query is called
    Then it should throw "Forbidden" error

  Scenario: Query allSystemUsers throws error when not authenticated
    Given no user is authenticated
    When allSystemUsers query is called
    Then it should throw "Unauthorized: Authentication required"

  Scenario: User union resolveType returns AdminUser
    Given a user object with userType admin-user
    When __resolveType is called
    Then it should return "AdminUser"

  Scenario: User union resolveType returns PersonalUser
    Given a user object with userType personal-user
    When __resolveType is called
    Then it should return "PersonalUser"

  Scenario: User union resolveType throws error for invalid type
    Given a user object with invalid userType
    When __resolveType is called
    Then it should throw "Unable to resolve User union type"
