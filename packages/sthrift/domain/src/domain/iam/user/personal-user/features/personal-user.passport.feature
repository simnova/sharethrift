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
    Then I should receive a PersonalUserListingPassport instance

  Scenario: Accessing the conversation passport
    When I create a PersonalUserPassport with a valid personal user
    And I access the conversation property
    Then I should receive a PersonalUserConversationPassport instance

  Scenario: Accessing the reservation request passport
    When I create a PersonalUserPassport with a valid personal user
    And I access the reservationRequest property
    Then I should receive a PersonalUserReservationRequestPassport instance

  Scenario: Accessing the account plan passport
    When I create a PersonalUserPassport with a valid personal user
    And I access the accountPlan property
    Then I should receive a PersonalUserAccountPlanPassport instance

  Scenario: Accessing the appeal request passport
    When I create a PersonalUserPassport with a valid personal user
    And I access the appealRequest property
    Then I should receive a PersonalUserAppealRequestPassport instance
 