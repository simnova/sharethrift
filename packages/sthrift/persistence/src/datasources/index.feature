Feature: DataSources Factory

  Background:
    Given a ModelsContext is available

  Scenario: Creating DataSourcesFactory with valid models
    Given the ModelsContext is valid
    When the DataSourcesFactory is created
    Then the factory should have a withPassport method
    And the factory should have a withSystemPassport method

  Scenario: Creating DataSources with Passport and MessagingService
    Given a valid Passport is provided
    And a valid MessagingService is provided
    When withPassport is called
    Then a DataSources object should be returned
    And the DataSources should have a domainDataSource
    And the DataSources should have a readonlyDataSource
    And the DataSources should have a messagingDataSource

  Scenario: Creating DataSources with SystemPassport
    When withSystemPassport is called
    Then a DataSources object should be returned
    And the DataSources should have a domainDataSource
    And the DataSources should have a readonlyDataSource
    And the DataSources should not have a messagingDataSource

  Scenario: DataSourcesFactory exports
    Then the DataSourcesFactoryImpl function should be exported
    And the DataSourcesFactory type should be exported
    And the DataSources type should be exported
