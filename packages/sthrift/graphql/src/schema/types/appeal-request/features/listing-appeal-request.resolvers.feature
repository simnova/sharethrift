Feature: Listing Appeal Request Resolvers
  Test ListingAppealRequest field resolvers, queries, and mutations

  Background:
    Given a GraphQL context with application services

  # Field Resolvers
  Scenario: ListingAppealRequest user field resolver returns populated user
    Given a listing appeal request with user ID
    When the user field resolver is called
    Then it should return the populated user entity

  Scenario: ListingAppealRequest listing field resolver returns populated listing
    Given a listing appeal request with listing ID
    When the listing field resolver is called
    Then it should return the populated item listing entity

  Scenario: ListingAppealRequest blocker field resolver returns populated blocker
    Given a listing appeal request with blocker ID
    When the blocker field resolver is called
    Then it should return the populated admin user entity

  # Query: getListingAppealRequest
  Scenario: Query getListingAppealRequest returns appeal request by ID
    When getListingAppealRequest query is called with valid ID
    Then it should return the listing appeal request entity

  # Query: getAllListingAppealRequests
  Scenario: Query getAllListingAppealRequests returns paginated requests
    When getAllListingAppealRequests query is called with pagination params
    Then it should return paginated listing appeal requests

  Scenario: Query getAllListingAppealRequests returns empty list when none exist
    When getAllListingAppealRequests query is called with no results
    Then it should return empty items array

  # Mutation: createListingAppealRequest
  Scenario: Mutation createListingAppealRequest creates new appeal request
    Given valid listing appeal request input data
    When createListingAppealRequest mutation is called
    Then it should create and return the new listing appeal request

  # Mutation: updateListingAppealRequestState
  Scenario: Mutation updateListingAppealRequestState updates request state
    Given a listing appeal request ID and new state
    When updateListingAppealRequestState mutation is called
    Then it should update the request state successfully

  Scenario: Mutation updateListingAppealRequestState normalizes state values
    Given a listing appeal request with Draft state
    When updateListingAppealRequestState mutation is called with lowercase state
    Then it should normalize the state to uppercase format
