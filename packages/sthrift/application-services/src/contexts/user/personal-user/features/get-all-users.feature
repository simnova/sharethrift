Feature: Get All Users

  Scenario: Successfully retrieving all users
    Given there are 3 users in the system
    When the getAllUsers command is executed
    Then 3 users should be returned

  Scenario: Retrieving all users when none exist
    Given there are no users in the system
    When the getAllUsers command is executed
    Then an empty array should be returned
