Feature: Messaging DataSource Implementation

  Background:
    Given a MessagingService is available
    And a Passport is available

  Scenario: Creating MessagingDataSource with valid service and passport
    Given the MessagingService is valid
    And the Passport is valid
    When the MessagingDataSource is created
    Then a MessagingDataSource object should be returned
    And the MessagingDataSource should have a Conversation property

  Scenario: MessagingDataSource context structure
    Given valid messaging service and passport
    When the MessagingDataSource is created
    Then Conversation context should have Conversation property
    And Conversation should have MessagingConversationRepo

  Scenario: MessagingDataSourceImplementation exports
    Then the MessagingDataSourceImplementation function should be exported
    And the MessagingDataSource type should be exported
