Feature: PaymentServiceMock

  Scenario: Instantiating with baseUrl
    Given a PaymentServiceMock with baseUrl "http://localhost:3001"
    When I instantiate the service
    Then the service should be an instance of PaymentServiceMock
    And the mockBaseUrl should be "http://localhost:3001"

  Scenario: Starting up the service
    Given a PaymentServiceMock
    When I start up the service
    Then it should return itself
    And the http property should be defined

  Scenario: Starting up twice throws
    Given a PaymentServiceMock
    When I start up the service twice
    Then an error should be thrown indicating already started

  Scenario: Shutting down after start
    Given a PaymentServiceMock
    When I start up and then shut down the service
    Then the http property should be undefined

  Scenario: Shutting down before start throws
    Given a PaymentServiceMock
    When I shut down before starting up
    Then an error should be thrown indicating not started

  Scenario: Accessing service before start throws
    Given a PaymentServiceMock
    When I access the service getter before starting up
    Then an error should be thrown indicating not started

  Scenario: Accessing service after start
    Given a PaymentServiceMock
    When I start up the service
    Then the service getter should return the http instance
