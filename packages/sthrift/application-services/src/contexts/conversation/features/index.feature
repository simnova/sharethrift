Feature: Conversation Context Factory

  Scenario: Creating Conversation context with all services
    Given valid data sources
    When Conversation context is created
    Then the context should be defined
    And Conversation service should be available

  Scenario: Verifying Conversation service methods
    Given valid data sources
    When Conversation context is created
    Then Conversation should have create method
    And Conversation should have queryById method
    And Conversation should have queryByUser method
