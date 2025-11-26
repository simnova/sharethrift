Feature: ReservationRequest Context Factory

  Scenario: Creating ReservationRequest context with all services
    Given valid data sources
    When ReservationRequest context is created
    Then the context should be defined
    And ReservationRequest service should be available

  Scenario: Verifying ReservationRequest service methods
    Given valid data sources
    When ReservationRequest context is created
    Then ReservationRequest should have create method
    And ReservationRequest should have queryById method
    And ReservationRequest should have queryActiveByListingId method
    And ReservationRequest should have queryActiveByReserverId method
    And ReservationRequest should have queryActiveByReserverIdAndListingId method
    And ReservationRequest should have queryListingRequestsBySharerId method
    And ReservationRequest should have queryOverlapByListingIdAndReservationPeriod method
    And ReservationRequest should have queryPastByReserverId method
