Feature: <PassportBase> PersonalUserPassportBase

  Background:
    Given a valid PersonalUserEntityReference with id "user-1"

  Scenario: Creating a PersonalUserPassportBase with a personal user
    When I create a PersonalUserPassportBase with the personal user
    Then the instance should store the user reference internally

  Scenario: Accessing the stored user reference
    Given a PersonalUserPassportBase created with a personal user
    When I access the _user property
    Then it should return the same PersonalUserEntityReference
 