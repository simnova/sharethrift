Feature: <Repository> ReservationRequestRepository

Background:
Given a ReservationRequestRepository instance with a working Mongoose model, type converter, and passport
And valid ReservationRequest documents exist in the database
And each ReservationRequest document includes populated 'listing' and 'reserver' fields

  Scenario: Getting a reservation request by ID
    Given a ReservationRequest document with id "reservation-1", state "Requested", and a populated reserver
    When I call getById with "reservation-1"
    Then I should receive a ReservationRequest domain object
    And the domain object should have state "Requested"
    And the domain object's reserver should be a PersonalUser domain object with correct user data
    And the domain object's listing should be a Listing domain object with correct listing data

  Scenario: Getting a reservation request by a nonexistent ID
    When I call getById with "nonexistent-id"
    Then an error should be thrown indicating "ReservationRequest with id nonexistent-id not found"

  Scenario: Getting all reservation requests
    When I call getAll
    Then I should receive a list of ReservationRequest domain objects
    And each reservation request should include populated reserver and listing domain objects

  Scenario: Creating a new reservation request instance
    Given a valid Listing domain entity reference
    And a valid PersonalUser domain entity reference as reserver
    And reservation period from "2025-10-20" to "2025-10-25"
    When I call getNewInstance with state "Requested", the listing, the reserver, and the reservation period
    Then I should receive a new ReservationRequest domain object
    And the new instance should have state "Requested"
    And the reservation period should be from "2025-10-20" to "2025-10-25"
    And the reserver should be the given user

  Scenario: Getting reservation requests by reserver ID
    Given a reserver with id "user-123"
    When I call getByReserverId with "user-123"
    Then I should receive all ReservationRequest domain objects created by that reserver
    And each reservation request should have reserver id "user-123"

  Scenario: Getting reservation requests by listing ID
    Given a listing with id "listing-456"
    When I call getByListingId with "listing-456"
    Then I should receive all ReservationRequest domain objects associated with that listing
    And each reservation request should have listing id "listing-456"

  Scenario: Creating a reservation request instance with invalid data
    Given an invalid reserver reference
    When I call getNewInstance with state "Requested", a valid listing, and the invalid reserver
    Then an error should be thrown indicating the reserver is not valid