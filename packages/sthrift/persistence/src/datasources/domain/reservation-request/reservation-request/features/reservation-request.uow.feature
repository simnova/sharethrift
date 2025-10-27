Feature: <UnitOfWork> ReservationRequestUnitOfWork

Background:
Given a Mongoose context factory with a working service
And a valid ReservationRequest model from the models context
And a valid passport for domain operations

Scenario: Creating a ReservationRequest Unit of Work
  When I call getReservationRequestUnitOfWork with the ReservationRequest model and passport
    Then I should receive a properly initialized ReservationRequestUnitOfWork
    And the Unit of Work should have the correct repository type
    And the Unit of Work should have the correct converter type
    And the Unit of Work should have the correct event buses