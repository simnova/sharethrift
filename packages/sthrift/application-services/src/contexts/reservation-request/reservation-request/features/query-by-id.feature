Feature: Query Reservation Request By ID

  Scenario: Successfully retrieving a reservation request by ID
    Given a valid reservation request ID "req-123"
    And the reservation request exists
    When the queryById command is executed
    Then the reservation request should be returned

  Scenario: Retrieving non-existent reservation request
    Given a reservation request ID "req-999" that does not exist
    When the queryById command is executed
    Then null should be returned
