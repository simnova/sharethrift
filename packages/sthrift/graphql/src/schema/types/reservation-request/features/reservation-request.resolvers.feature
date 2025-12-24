Feature: Reservation Request Resolvers

As an API consumer
I want to query and create reservation requests
So that I can view my reservations and make new ones through the GraphQL API

  Scenario: Querying active reservations for a user
    Given a valid userId
    When the myActiveReservations query is executed
    Then it should call ReservationRequest.queryActiveByReserverId with the provided userId
    And it should return a list of active reservations

  Scenario: No active reservations for a user
    Given a valid userId
    And ReservationRequest.queryActiveByReserverId returns an empty list
    When the myActiveReservations query is executed
    Then it should return an empty array

  Scenario: Error while querying active reservations
    Given ReservationRequest.queryActiveByReserverId throws an error
    When the myActiveReservations query is executed
    Then it should propagate the error message

  Scenario: Querying past reservations for a user
    Given a valid userId
    When the myPastReservations query is executed
    Then it should call ReservationRequest.queryPastByReserverId with the provided userId
    And it should return a list of past reservations

  Scenario: No past reservations for a user
    Given a valid userId
    And ReservationRequest.queryPastByReserverId returns an empty list
    When the myPastReservations query is executed
    Then it should return an empty array

  Scenario: Error while querying past reservations
    Given ReservationRequest.queryPastByReserverId throws an error
    When the myPastReservations query is executed
    Then it should propagate the error message

  Scenario: Querying reservation requests for listings owned by sharer
    Given a valid sharerId and reservation requests
    When the myListingsRequests query is executed
    Then it should return raw domain objects without UI transformation

  Scenario: Returning all reservation requests without filtering
    Given reservation requests for a sharer
    When the myListingsRequests query is executed
    Then all reservation requests should be returned

  Scenario: Returning mixed status reservation requests
    Given reservation requests with mixed statuses
    When the myListingsRequests query is executed
    Then all requests should be returned with their domain state

  Scenario: Returning reservation requests with different timestamps
    Given reservation requests with varying createdAt timestamps
    When the myListingsRequests query is executed
    Then all requests should be returned in their original order

  Scenario: Error while querying myListingsRequests
    Given ReservationRequest.queryListingRequestsBySharerId throws an error
    When the myListingsRequests query is executed
    Then it should propagate the error message

  Scenario: Querying active reservation for a specific listing
    Given a valid listingId and userId
    When the myActiveReservationForListing query is executed
    Then it should call ReservationRequest.queryActiveByReserverIdAndListingId with those IDs
    And it should return the corresponding reservation if found

  Scenario: No active reservation found for listing
    Given a valid listingId and userId
    And ReservationRequest.queryActiveByReserverIdAndListingId returns null
    When the myActiveReservationForListing query is executed
    Then it should return null

  Scenario: Error while querying active reservation for listing
    Given ReservationRequest.queryActiveByReserverIdAndListingId throws an error
    When the myActiveReservationForListing query is executed
    Then it should propagate the error message

  Scenario: Querying active reservations by listing ID
    Given a valid listingId
    When the queryActiveByListingId query is executed
    Then it should call ReservationRequest.queryActiveByListingId with that listingId
    And it should return all active reservations for that listing

  Scenario: No active reservations found for listing
    Given a valid listingId
    And ReservationRequest.queryActiveByListingId returns an empty list
    When the queryActiveByListingId query is executed
    Then it should return an empty array

  Scenario: Error while querying active reservations by listing ID
    Given ReservationRequest.queryActiveByListingId throws an error
    When the queryActiveByListingId query is executed
    Then it should propagate the error message

  Scenario: Creating a reservation request successfully
    Given a verified user with a valid verifiedJwt containing email
    And a valid input with listingId and reservationPeriod dates
    When the createReservationRequest mutation is executed
    Then it should call ReservationRequest.create with listingId, reservationPeriodStart, reservationPeriodEnd, and reserverEmail
    And it should return the created reservation request

  Scenario: Creating a reservation request without authentication
    Given a user without a verifiedJwt in their context
    When the createReservationRequest mutation is executed
    Then it should throw a "User must be authenticated to create a reservation request" error

  Scenario: Creating a reservation request with invalid dates
    Given a verified user and input where reservationPeriodStart is after reservationPeriodEnd
    When the createReservationRequest mutation is executed
    Then it should throw a validation or business rule error

  Scenario: Error while creating a reservation request
    Given a verified user
    And ReservationRequest.create throws an error
    When the createReservationRequest mutation is executed
    Then it should propagate the error message

  Scenario: Returning domain reservation request objects
    Given a reservation request with complete domain properties
    When the myListingsRequests query is executed
    Then it should return domain objects with all properties

  Scenario: Returning all listing requests
    Given 25 listing requests
    When the myListingsRequests query is executed
    Then it should return all 25 requests

  Scenario: Returning listing requests with different titles
    Given multiple listing requests with varying titles
    When the myListingsRequests query is executed
    Then all requests should be returned in their original order

  Scenario: Accepting a reservation request successfully
    Given a verified user with a valid verifiedJwt containing email
    And a valid reservation request id
    When the acceptReservationRequest mutation is executed
    Then it should call ReservationRequest.update with id and state "Accepted"
    And it should return the accepted reservation request

  Scenario: Accepting a reservation request without authentication
    Given a user without a verifiedJwt in their context
    When the acceptReservationRequest mutation is executed
    Then it should throw a "User must be authenticated to accept a reservation request" error