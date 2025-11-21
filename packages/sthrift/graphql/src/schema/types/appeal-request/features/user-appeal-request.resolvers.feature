Feature: User Appeal Request Resolvers
  Test UserAppealRequest field resolvers, queries, and mutations

  Background:
    Given a GraphQL context with application services

  # Field Resolvers
  Scenario: UserAppealRequest user field resolver returns populated user
    Given a user appeal request with user ID
    When the user field resolver is called
    Then it should return the populated personal user entity

  Scenario: UserAppealRequest blocker field resolver returns populated blocker
    Given a user appeal request with blocker ID
    When the blocker field resolver is called
    Then it should return the populated admin user entity

  # Query: getUserAppealRequest
  Scenario: Query getUserAppealRequest returns appeal request by ID
    When getUserAppealRequest query is called with valid ID
    Then it should return the user appeal request entity

  # Query: getAllUserAppealRequests
  Scenario: Query getAllUserAppealRequests returns paginated requests
    When getAllUserAppealRequests query is called with pagination params
    Then it should return paginated user appeal requests

  Scenario: Query getAllUserAppealRequests returns empty list when none exist
    When getAllUserAppealRequests query is called with no results
    Then it should return empty items array

  # Mutation: createUserAppealRequest
  Scenario: Mutation createUserAppealRequest creates new appeal request
    Given valid user appeal request input data
    When createUserAppealRequest mutation is called
    Then it should create and return the new user appeal request

  # Mutation: updateUserAppealRequestState
  Scenario: Mutation updateUserAppealRequestState updates request state
    Given a user appeal request ID and new state
    When updateUserAppealRequestState mutation is called
    Then it should update the request state successfully

  Scenario: Mutation updateUserAppealRequestState normalizes state values
    Given a user appeal request with Draft state
    When updateUserAppealRequestState mutation is called with lowercase state
    Then it should normalize the state to uppercase format
