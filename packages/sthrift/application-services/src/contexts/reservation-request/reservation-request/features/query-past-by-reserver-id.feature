Feature: Query Past Reservation Requests By Reserver ID

  Scenario: Successfully retrieving past reservation requests for a reserver
    Given a valid reserver ID "user-123"
    And the reserver has 2 past reservation requests
    When the queryPastByReserverId command is executed
    Then 2 reservation requests should be returned

  Scenario: Retrieving past requests for reserver with no past requests
    Given a valid reserver ID "user-456"
    And the reserver has no past reservation requests
    When the queryPastByReserverId command is executed
    Then an empty array should be returned
