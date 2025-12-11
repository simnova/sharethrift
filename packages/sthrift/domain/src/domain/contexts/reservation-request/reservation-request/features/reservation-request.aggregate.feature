Feature: Reservation Request Aggregate
  The ReservationRequest aggregate manages the lifecycle of a reservation between a sharer and a reserver for an item listing.

  Scenario: Create a new reservation request
    Given a valid item listing and a personal user
    When a reservation request is created with valid dates
    Then the reservation request should be in the REQUESTED state
    And the listing and reserver references should be set

  Scenario: Reject reservation with invalid dates
    Given a valid item listing and a personal user
    When a reservation request is created with the start date after the end date
    Then an error should be thrown

  Scenario: Accept a reservation request
    Given a reservation request in REQUESTED state
    When the reservation is accepted
    Then the reservation request should be in the ACCEPTED state
    And the request remains associated to the same listing and reserver

  Scenario: Cancel a reservation request
    Given a reservation request in REQUESTED state
    When the reservation is cancelled
    Then the reservation request should be in the CANCELLED state
    And close flags should remain false

  Scenario: Close a reservation request by sharer
    Given a reservation request in ACCEPTED state and close requested by sharer
    When the reservation is closed
    Then the reservation request should be in the CLOSED state
    And closeRequestedBySharer should be true

  Scenario: Close a reservation request by reserver
    Given a reservation request in ACCEPTED state and close requested by reserver
    When the reservation is closed
    Then the reservation request should be in the CLOSED state
    And closeRequestedByReserver should be true

  Scenario: Request close by reserver
    Given a reservation request in ACCEPTED state
    When the reserver requests to close
    Then closeRequestedByReserver should be true
