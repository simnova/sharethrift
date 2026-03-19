Feature: Reservation Request Data Source
  The ReservationRequestDataSource provides read-only access patterns for reservation requests
  and must expose core query methods.

  Background:
    Given a Mongoose ReservationRequest model

  Scenario: Instantiate data source with a model
    When I create a ReservationRequestDataSource with the model
    Then the data source instance should be defined
    And the data source instance should be a ReservationRequestDataSourceImpl

  Scenario: Exposes find method
    Given a ReservationRequestDataSource instance
    Then it should have a "find" method

  Scenario: Exposes findById method
    Given a ReservationRequestDataSource instance
    Then it should have a "findById" method

  Scenario: Exposes findOne method
    Given a ReservationRequestDataSource instance
    Then it should have a "findOne" method
