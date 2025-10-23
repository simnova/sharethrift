Feature: <Passport> PersonalUserUserPassport

  Background:
    Given a valid PersonalUserEntityReference with id "user-1"
    And a valid root PersonalUserEntityReference with id "root-1"
    And a valid AdminUserEntityReference with id "admin-1"

  Scenario: Creating a PersonalUserUserPassport
    When I create a PersonalUserUserPassport with the personal user
    Then the passport should be created successfully

  Scenario: forPersonalUser returns a PersonalUserUserVisa
    Given a PersonalUserUserPassport for the user
    When I call forPersonalUser with the root
    Then it should return a PersonalUserUserVisa instance

  Scenario: forAdminUser returns a UserVisa with determineIf always false
    Given a PersonalUserUserPassport for the user
    When I call forAdminUser with the admin root
    And I call determineIf with any function
    Then the result should be false
 