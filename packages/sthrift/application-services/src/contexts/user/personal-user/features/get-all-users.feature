Feature: Get All Users

  Scenario: Successfully retrieving all users
    Given there are 3 users in the system
    When the getAllUsers command is executed
    Then 3 users should be returned

  Scenario: Retrieving all users when none exist
    Given there are no users in the system
    When the getAllUsers command is executed
    Then an empty array should be returned

  Scenario: Retrieving users with search text
    Given there are users matching the search criteria
    When the getAllUsers command is executed with searchText
    Then filtered users should be returned

  Scenario: Retrieving users with status filters
    Given there are users with various statuses
    When the getAllUsers command is executed with statusFilters
    Then users matching status filters should be returned

  Scenario: Retrieving users with sorter ascending
    Given there are users in the system
    When the getAllUsers command is executed with sorter order ascend
    Then sorted users should be returned

  Scenario: Retrieving users with sorter descending
    Given there are users in the system
    When the getAllUsers command is executed with sorter order descend
    Then sorted users in descending order should be returned

  Scenario: Retrieving users with invalid sorter order
    Given there are users in the system
    When the getAllUsers command is executed with invalid sorter order
    Then users should be returned with default ascend order
