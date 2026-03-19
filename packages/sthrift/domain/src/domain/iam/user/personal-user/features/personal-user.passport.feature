Feature: PersonalUserPassport

  Background:
    Given a valid PersonalUserEntityReference

  Scenario: Creating a PersonalUserPassport with a valid personal user
    When I create a PersonalUserPassport with the personal user
    Then the passport should be created successfully

  Scenario: Accessing the user passport
    When I create a PersonalUserPassport with a valid personal user
    And I access the user property
    Then I should receive a PersonalUserUserPassport instance

  Scenario: Accessing the listing passport
    When I create a PersonalUserPassport with a valid personal user
    And I access the listing property
    Then an error should be thrown indicating the method is not implemented

  Scenario: Accessing the conversation passport
    When I create a PersonalUserPassport with a valid personal user
    And I access the conversation property
    Then an error should be thrown indicating the method is not implemented

  Scenario: Accessing the reservation request passport
    When I create a PersonalUserPassport with a valid personal user
    And I access the reservationRequest property
    Then an error should be thrown indicating the method is not implemented
 