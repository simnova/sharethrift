Feature: PaymentServiceCybersource

  Scenario: Instantiating with valid config
    Given a valid PaymentServiceCybersource configuration
    When I instantiate the service
    Then the service should be an instance of PaymentServiceCybersource

  Scenario: Instantiating with missing config
    Given an invalid PaymentServiceCybersource configuration
    When I instantiate the service
    Then an error should be thrown

  Scenario: Service configObject properties
    Given a valid PaymentServiceCybersource configuration
    When I instantiate the service
    Then the configObject should have correct properties
