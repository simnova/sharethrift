Feature: Transactional Email Service Mock implementation
  Scenario: Service class lifecycle
    Given the ServiceTransactionalEmailMock class is available
    When I start the service
    Then the service should be initialized
    When I stop the service
    Then the service should be disposed

  Scenario: Writes emails to tmp directory
    Given the service is started
    When I send a templated email
    Then an HTML file should be written to the output directory
