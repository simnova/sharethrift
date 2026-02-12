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
    Given a valid sharerId
    And valid pagination arguments (page, pageSize)
    When the myListingsRequests query is executed
    Then it should call ReservationRequest.queryListingRequestsBySharerId with the provided sharerId
    And it should paginate and map the results using paginateAndFilterListingRequests
    And it should return items, total, page, and pageSize

  Scenario: Filtering myListingsRequests by search text
    Given reservation requests for a sharer
    And a searchText "camera"
    When the myListingsRequests query is executed
    Then only listings whose titles include "camera" should be returned

  Scenario: Filtering myListingsRequests by status
    Given reservation requests with mixed statuses ["Pending", "Accepted"]
    And a statusFilters ["Accepted"]
    When the myListingsRequests query is executed
    Then only requests with status "Accepted" should be included

  Scenario: Sorting myListingsRequests by requestedOn descending
    Given reservation requests with varying createdAt timestamps
    And sorter field "requestedOn" with order "descend"
    When the myListingsRequests query is executed
    Then results should be sorted by requestedOn in descending order

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

  Scenario: Paginating listing requests
    Given 25 listing requests and a pageSize of 10
    When the myListingsRequests query is executed for page 2
    Then it should return 10 items for page 2 and total 25

  Scenario: Sorting listing requests by title ascending
    Given multiple listing requests with varying titles
    And sorter field "title" with order "ascend"
    When the myListingsRequests query is executed
    Then the results should be sorted alphabetically by title

  Scenario: Sorting myListingsRequests by state descending
    Given reservation requests with different states
    And sorter field "state" with order "descend"
    When the myListingsRequests query is executed
    Then results should be sorted by state in descending order

  Scenario: Sorting myListingsRequests by createdAt ascending
    Given reservation requests with different creation dates
    And sorter field "createdAt" with order "ascend"
    When the myListingsRequests query is executed
    Then results should be sorted by createdAt in ascending order

  Scenario: myListingsRequests with invalid sorter order defaults to null
    Given reservation requests for a sharer
    And a sorter with invalid order value
    When the myListingsRequests query is executed
    Then it should call queryListingRequestsBySharerId with sorter order set to null

  Scenario: myListingsRequests with combined search, filters, and sorting
    Given reservation requests with mixed properties
    And search text "camera", status filters ["Accepted"], and sorter by title ascending
    When the myListingsRequests query is executed
    Then it should call queryListingRequestsBySharerId with all combined parameters
    And it should return filtered and sorted results

  Scenario: myListingsRequests with no matching results after filtering
    Given reservation requests for a sharer
    And no requests match the strict filter criteria
    When the myListingsRequests query is executed
    Then it should return empty results with total 0

  Scenario: myListingsRequests with null sorter field
    Given reservation requests for a sharer
    And a sorter with null field
    When the myListingsRequests query is executed
    Then it should call queryListingRequestsBySharerId with sorter field set to null