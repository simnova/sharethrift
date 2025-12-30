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
    And closeRequestedBy should remain null

  Scenario: Close a reservation request by sharer
    Given a reservation request in ACCEPTED state and close requested by sharer
    When the reservation is closed
    Then the reservation request should be in the CLOSED state
    And closeRequestedBy should be "SHARER"

  Scenario: Close a reservation request by reserver
    Given a reservation request in ACCEPTED state and close requested by reserver
    When the reservation is closed
    Then the reservation request should be in the CLOSED state
    And closeRequestedBy should be "RESERVER"

  Scenario: Request close by reserver
    Given a reservation request in ACCEPTED state
    When the reserver requests to close
    Then closeRequestedBy should be "RESERVER"
