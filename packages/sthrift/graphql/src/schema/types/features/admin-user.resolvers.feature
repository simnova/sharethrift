Feature: AdminUser GraphQL Resolvers

  Background:
    Given a verified JWT admin user context exists
    And the GraphContext is initialized with AdminUser application services

  Scenario: Resolving AdminUser role field
    Given an AdminUser object with a role
    When the "role" field resolver is called
    Then it should check if the current user can view the role
    And return the role if authorized or null otherwise

  Scenario: Resolving AdminUser account field
    Given an AdminUser object with account information
    When the "account" field resolver is called
    Then it should return the account object

  Scenario: Resolving AdminUser userIsAdmin field
    Given a GraphQL context with a verified user
    When the "userIsAdmin" field resolver is called
    Then it should call currentViewerIsAdmin helper
    And return true if the viewer is an admin

  Scenario: Querying current admin user
    Given a verified admin user with email "admin@example.com"
    When I execute the query "currentAdminUser"
    Then it should throw an error if not authenticated
    And the resolver should call "User.AdminUser.queryByEmail" with the current user's email
    And it should return the current AdminUser entity

  Scenario: Querying admin dashboard users while authenticated
    Given an authenticated admin user
    When I execute the query "adminDashboardUsers" with pagination parameters
    Then the resolver should call "User.PersonalUser.getAllUsers" with query parameters
    And it should return a list of personal users for the admin dashboard

  Scenario: Querying admin dashboard users without admin access
    Given an authenticated user without admin access
    When I execute the query "adminDashboardUsers"
    Then it should throw a Forbidden error

  Scenario: Creating a new admin user with permissions
    Given a verified admin with canManageUserRoles permission
    And a valid AdminUserCreateInput with email "newadmin@example.com"
    When I execute the mutation "createAdminUser"
    Then it should check authentication and permissions
    And the resolver should call "User.AdminUser.createIfNotExists"
    And it should return the newly created AdminUser entity

  Scenario: Creating a new admin user without permissions
    Given a verified user without canManageUserRoles permission
    When I execute the mutation "createAdminUser"
    Then it should throw a Forbidden error

  Scenario: Updating admin user information
    Given a verified admin user
    And a valid AdminUserUpdateInput with id "admin-user-123"
    When I execute the mutation "adminUserUpdate"
    Then it should check authentication
    And the resolver should call "User.AdminUser.update"
    And it should return the updated AdminUser entity
