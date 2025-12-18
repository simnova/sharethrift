Feature: Cancel Reservation Request
  As a reserver
  I want to cancel my reservation request
  So that I can withdraw my request before it is accepted

  Scenario: Successfully cancelling a requested reservation
    Given a valid reservation request ID "reservation-123"
    And the reservation request exists and is in requested state
    When the cancel command is executed
    Then the reservation request should be cancelled

  Scenario: Attempting to cancel a non-existent reservation request
    Given a reservation request ID "reservation-999"
    And the reservation request does not exist
    When the cancel command is executed
    Then an error "Reservation request not found" should be thrown

  Scenario: Cancel fails when save returns undefined
    Given a valid reservation request ID "reservation-456"
    And the reservation request exists
    And save returns undefined
    When the cancel command is executed
    Then an error "Reservation request not cancelled" should be thrown

  Scenario: Authorization failure when caller is not the reserver
    Given a reservation request ID "reservation-789"
    And the reservation request belongs to a different user
    When the cancel command is executed
    Then an error "Only the reserver can cancel their reservation request" should be thrown
