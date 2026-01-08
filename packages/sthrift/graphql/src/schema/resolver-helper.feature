Feature: GraphQL Resolver Helper Functions

  Background:
    Given a GraphQL context with application services

  Scenario: getUserByEmail finds AdminUser
    When getUserByEmail is called with an admin user email
    Then it should return the AdminUser entity

  Scenario: getUserByEmail finds PersonalUser
    When getUserByEmail is called with a personal user email
    Then it should return the PersonalUser entity

  Scenario: getUserByEmail returns null when user not found
    When getUserByEmail is called with a non-existent email
    Then it should return null

  Scenario: currentViewerIsAdmin returns true for admin user
    Given the verified user is an admin
    When currentViewerIsAdmin is called
    Then it should return true

  Scenario: currentViewerIsAdmin returns false for personal user
    Given the verified user is a personal user
    When currentViewerIsAdmin is called
    Then it should return false

  Scenario: currentViewerIsAdmin returns false when no verified user
    Given there is no verified user
    When currentViewerIsAdmin is called
    Then it should return false

  Scenario: PopulateUserFromField resolves AdminUser by ID
    Given a parent object with a valid admin user ID field
    When PopulateUserFromField resolver is called
    Then it should return the AdminUser entity

  Scenario: PopulateUserFromField resolves PersonalUser by ID
    Given a parent object with a valid personal user ID field
    When PopulateUserFromField resolver is called
    Then it should return the PersonalUser entity

  Scenario: PopulateUserFromField returns field value for invalid ID
    Given a parent object with an invalid user ID
    When PopulateUserFromField resolver is called
    Then it should return the original field value

  Scenario: PopulateUserFromField returns original object when lookups fail
    Given both AdminUser and PersonalUser lookups return null
    When PopulateUserFromField resolver is called
    Then it should fall back to the original field object

  Scenario: PopulateItemListingFromField resolves listing by ID
    Given a parent object with a valid listing ID field
    When PopulateItemListingFromField resolver is called
    Then it should return the ItemListing entity

  Scenario: PopulateItemListingFromField returns field value for invalid ID
    Given a parent object with an invalid listing ID
    When PopulateItemListingFromField resolver is called
    Then it should return the original field value

  Scenario: PopulateItemListingFromField skips lookup for non-ObjectId shapes
    Given listingId has an id field that is not a valid ObjectId
    When PopulateItemListingFromField resolver is called
    Then it should return the original listing object without querying

  Scenario: getRequestedFieldPaths extracts field paths from selection
    Given a GraphQL resolve info with field selections
    When getRequestedFieldPaths is called
    Then it should return all leaf field paths

  Scenario: getRequestedFieldPaths handles fragments
    Given a GraphQL resolve info with fragment spreads
    When getRequestedFieldPaths is called
    Then it should expand fragments and return all field paths

  Scenario: getRequestedFieldPaths handles inline fragments
    Given a GraphQL resolve info with inline fragments
    When getRequestedFieldPaths is called
    Then it should include fields from inline fragments

  Scenario: getRequestedFieldPaths excludes __typename
    Given a GraphQL resolve info with __typename selections
    When getRequestedFieldPaths is called
    Then it should exclude __typename from results
