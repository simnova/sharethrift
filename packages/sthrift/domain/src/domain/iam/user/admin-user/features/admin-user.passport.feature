Feature: AdminUserPassport

  Background:
    Given a valid AdminUserEntityReference

  Scenario: Creating an AdminUserPassport with a valid admin user
    When I create an AdminUserPassport with the admin user
    Then the passport should be created successfully

  Scenario: Accessing the user passport
    When I create an AdminUserPassport with a valid admin user
    And I access the user property
    Then I should receive an AdminUserUserPassport instance

  Scenario: Accessing the listing passport
    When I create an AdminUserPassport with a valid admin user
    And I access the listing property
    Then I should receive an AdminUserListingPassport instance

  Scenario: Accessing the conversation passport
    When I create an AdminUserPassport with a valid admin user
    And I access the conversation property
    Then I should receive an AdminUserConversationPassport instance

  Scenario: Accessing the reservation request passport
    When I create an AdminUserPassport with a valid admin user
    And I access the reservationRequest property
    Then I should receive an AdminUserReservationRequestPassport instance
