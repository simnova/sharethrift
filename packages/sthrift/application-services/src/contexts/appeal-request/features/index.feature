Feature: AppealRequest Context Factory

  Scenario: Creating AppealRequest context with all services
    Given valid data sources
    When AppealRequest context is created
    Then the context should be defined
    And ListingAppealRequest service should be available
    And UserAppealRequest service should be available

  Scenario: Verifying ListingAppealRequest service methods
    Given valid data sources
    When AppealRequest context is created
    Then ListingAppealRequest should have create method
    And ListingAppealRequest should have getAll method
    And ListingAppealRequest should have getById method
    And ListingAppealRequest should have updateState method

  Scenario: Verifying UserAppealRequest service methods
    Given valid data sources
    When AppealRequest context is created
    Then UserAppealRequest should have create method
    And UserAppealRequest should have getAll method
    And UserAppealRequest should have getById method
    And UserAppealRequest should have updateState method
