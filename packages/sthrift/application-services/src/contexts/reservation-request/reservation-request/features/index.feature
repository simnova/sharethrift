Feature: Reservation Request Application Service

  Scenario: Creating a reservation request through the application service
    Given a reservation request application service
    When I create a reservation request
    Then it should delegate to the create function

  Scenario: Querying a reservation request by ID through the application service
    Given a reservation request application service
    When I query for reservation request with id "req-123"
    Then it should delegate to the queryById function

  Scenario: Querying active reservation requests by reserver ID through the application service
    Given a reservation request application service
    When I query for active requests by reserver "reserver-1"
    Then it should delegate to the queryActiveByReserverId function

  Scenario: Querying past reservation requests by reserver ID through the application service
    Given a reservation request application service
    When I query for past requests by reserver "reserver-1"
    Then it should delegate to the queryPastByReserverId function

  Scenario: Querying active reservation requests by reserver and listing through the application service
    Given a reservation request application service
    When I query for active requests by reserver "reserver-1" and listing "listing-1"
    Then it should delegate to the queryActiveByReserverIdAndListingId function

  Scenario: Querying overlapping reservation requests through the application service
    Given a reservation request application service
    When I query for overlapping requests for listing "listing-1"
    Then it should delegate to the queryOverlapByListingIdAndReservationPeriod function

  Scenario: Querying active reservation requests by listing ID through the application service
    Given a reservation request application service
    When I query for active requests by listing "listing-1"
    Then it should delegate to the queryActiveByListingId function

  Scenario: Querying reservation requests by sharer ID through the application service
    Given a reservation request application service
    When I query for requests by sharer "sharer-1"
    Then it should delegate to the queryListingRequestsBySharerId function
