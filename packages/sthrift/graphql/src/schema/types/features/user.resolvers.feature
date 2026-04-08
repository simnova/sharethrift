Feature: User Union Resolvers

  Background:
    Given a GraphQL context with application services

  Scenario: Query currentUser returns authenticated user
    Given a verified personal user is authenticated
    When currentUser query is called
    Then it should return the authenticated user

  Scenario: Query currentUser throws error for admin users
    Given a verified admin user is authenticated
    When currentUser query is called
    Then it should throw "Forbidden: Admin users cannot use currentUser. Use currentAdminUser instead."

  Scenario: Query currentUser throws error when not authenticated
    Given no user is authenticated
    When currentUser query is called
    Then it should throw "Unauthorized: Authentication required"

  Scenario: Query currentUser throws error when user not found
    Given a verified user is authenticated but not in database
    When currentUser query is called
    Then it should throw "User not found"

  Scenario: Query currentUserAndCreateIfNotExists returns existing user
    Given a verified personal user is authenticated and exists in database
    When currentUserAndCreateIfNotExists query is called
    Then it should return the existing user

  Scenario: Query currentUserAndCreateIfNotExists creates new PersonalUser
    Given a verified user is authenticated but not in database
    When currentUserAndCreateIfNotExists query is called
    Then it should create and return a new PersonalUser

  Scenario: Query currentUserAndCreateIfNotExists throws error for admin users
    Given a verified admin user is authenticated
    When currentUserAndCreateIfNotExists query is called
    Then it should throw "Forbidden: Admin users cannot use currentUserAndCreateIfNotExists. Use currentAdminUser instead."

  Scenario: Query currentUserAndCreateIfNotExists throws error when not authenticated
    Given no user is authenticated
    When currentUserAndCreateIfNotExists query is called
    Then it should throw "Unauthorized: Authentication required"

  Scenario: Query currentUserAndCreateIfNotExists handles creation failure
    Given a verified user is authenticated but not in database
    And the createIfNotExists operation fails
    When currentUserAndCreateIfNotExists query is called
    Then it should propagate the error from application service

  Scenario: User union resolveType returns PersonalUser
    Given a user object with userType personal-user
    When __resolveType is called
    Then it should return "PersonalUser"

  Scenario: User union resolveType throws error for invalid type
    Given a user object with invalid userType
    When __resolveType is called
    Then it should throw "Unable to resolve User union type"
