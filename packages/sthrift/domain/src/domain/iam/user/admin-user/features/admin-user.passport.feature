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
    Then an error should be thrown indicating the method is not implemented

  Scenario: Accessing the conversation passport
    When I create an AdminUserPassport with a valid admin user
    And I access the conversation property
    Then an error should be thrown indicating the method is not implemented

  Scenario: Accessing the reservation request passport
    When I create an AdminUserPassport with a valid admin user
    And I access the reservationRequest property
    Then an error should be thrown indicating the method is not implemented
