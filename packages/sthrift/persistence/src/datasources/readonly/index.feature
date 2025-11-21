Feature: Readonly DataSource Implementation

  Background:
    Given a ModelsContext is available
    And a Passport is available

  Scenario: Creating ReadonlyDataSource with valid models and passport
    Given the ModelsContext is valid
    And the Passport is valid
    When the ReadonlyDataSource is created
    Then a ReadonlyDataSource object should be returned
    And the ReadonlyDataSource should have a User property
    And the ReadonlyDataSource should have a ReservationRequest property
    And the ReadonlyDataSource should have a Listing property
    And the ReadonlyDataSource should have a Conversation property
    And the ReadonlyDataSource should have an AppealRequest property

  Scenario: ReadonlyDataSource context structure
    Given valid models and passport
    When the ReadonlyDataSource is created
    Then User context should have PersonalUser and AdminUser
    And ReservationRequest context should have ReservationRequest
    And Listing context should have ItemListing
    And Conversation context should have Conversation
    And AppealRequest context should have ListingAppealRequest and UserAppealRequest

  Scenario: ReadonlyDataSourceImplementation exports
    Then the ReadonlyDataSourceImplementation function should be exported
    And the ReadonlyDataSource type should be exported
