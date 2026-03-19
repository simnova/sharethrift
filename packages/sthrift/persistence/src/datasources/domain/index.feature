Feature: Domain DataSource Implementation

  Background:
    Given a ModelsContext is available
    And a Passport is available

  Scenario: Creating DomainDataSource with valid models and passport
    Given the ModelsContext is valid
    And the Passport is valid
    When the DomainDataSource is created
    Then a DomainDataSource object should be returned
    And the DomainDataSource should have a User property
    And the DomainDataSource should have a Listing property
    And the DomainDataSource should have a Conversation property
    And the DomainDataSource should have a ReservationRequest property
    And the DomainDataSource should have an AppealRequest property

  Scenario: DomainDataSource context initialization
    Given valid models and passport
    When the DomainDataSource is created
    Then each context should be properly initialized
    And User context should have repository and unit of work
    And Listing context should have repository and unit of work
    And Conversation context should have repository and unit of work
    And ReservationRequest context should have repository and unit of work
    And AppealRequest context should have repository and unit of work

  Scenario: DomainDataSourceImplementation exports
    Then the DomainDataSourceImplementation function should be exported
