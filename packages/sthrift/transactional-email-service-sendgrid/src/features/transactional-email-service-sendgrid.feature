Feature: Transactional Email Service SendGrid implementation
  Scenario: Service class lifecycle
    Given the ServiceTransactionalEmailSendGrid class is available
    When I start the service
    Then the service should be initialized
    When I stop the service
    Then the service should be disposed

  Scenario: Fails to send before startup
    Given a new ServiceTransactionalEmailSendGrid instance
    Then calling sendTemplatedEmail before startUp should throw an error
