Feature: Reservation value objects

  # ReservationPeriodStart
  Scenario: Creating a ReservationPeriodStart with a valid value
    When I create a ReservationPeriodStart with "2025-10-15T10:00:00Z"
    Then the value should be "2025-10-15T10:00:00Z"

  Scenario: Creating a ReservationPeriodStart with null
    When I try to create a ReservationPeriodStart with null
    Then an error should be thrown indicating the value is invalid

  # ReservationPeriodEnd
  Scenario: Creating a ReservationPeriodEnd with a valid value
    When I create a ReservationPeriodEnd with "2025-10-20T10:00:00Z"
    Then the value should be "2025-10-20T10:00:00Z"

  Scenario: Creating a ReservationPeriodEnd with null
    When I try to create a ReservationPeriodEnd with null
    Then an error should be thrown indicating the value is invalid

  # ReservationRequestStateValue
  Scenario: Creating a ReservationRequestStateValue with a valid state
    When I create a ReservationRequestStateValue with "Requested"
    Then the value should be "Requested"

  Scenario: Creating a ReservationRequestStateValue with another valid state
    When I create a ReservationRequestStateValue with "Accepted"
    Then the value should be "Accepted"

  Scenario: Creating a ReservationRequestStateValue with an invalid state
    When I try to create a ReservationRequestStateValue with "InvalidState"
    Then an error should be thrown indicating the state is invalid

  Scenario: Creating a ReservationRequestStateValue with null
    When I try to create a ReservationRequestStateValue with null
    Then an error should be thrown indicating the value is invalid

  Scenario: Creating a ReservationRequestStateValue with an empty string
    When I try to create a ReservationRequestStateValue with an empty string
    Then an error should be thrown indicating the value is invalid
 