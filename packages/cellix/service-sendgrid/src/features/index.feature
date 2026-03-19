Feature: SendGrid Index Exports
  As a developer
  I want to import SendGrid class from the index
  So that I can use it in my application

  Scenario: Exporting SendGrid as default
    When I import the default export from the index
    Then it should be the SendGrid class
