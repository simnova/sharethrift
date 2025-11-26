Feature: Persistence Factory

  Background:
    Given a MongooseContextFactory is available

  Scenario: Creating Persistence factory with valid service
    Given the MongooseContextFactory has a valid service
    When the Persistence factory is created
    Then the DataSourcesFactory should be returned

  Scenario: Creating Persistence factory without service
    Given the MongooseContextFactory has no service
    When the Persistence factory is created
    Then an error should be thrown with message "MongooseSeedwork.MongooseContextFactory is required"

  Scenario: Creating Persistence factory with undefined service
    Given the MongooseContextFactory service is undefined
    When the Persistence factory is created
    Then an error should be thrown with message "MongooseSeedwork.MongooseContextFactory is required"

  Scenario: Persistence function exports
    Then the Persistence function should be exported
    And the DataSourcesFactory type should be exported
    And the DataSources type should be exported
