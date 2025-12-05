Feature: Query Active Reservation Requests By Reserver ID

  Scenario: Successfully retrieving active reservation requests for a reserver
    Given a valid reserver ID "user-123"
    And the reserver has 3 active reservation requests
    When the queryActiveByReserverId command is executed
    Then 3 reservation requests should be returned

  Scenario: Retrieving active reservation requests for reserver with no requests
    Given a valid reserver ID "user-456"
    And the reserver has no active reservation requests
    When the queryActiveByReserverId command is executed
    Then an empty array should be returned
