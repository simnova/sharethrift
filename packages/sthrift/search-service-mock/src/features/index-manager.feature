Feature: Index Manager

  Scenario: Creating a new index
    When I create an index with fields
    Then the index should exist

  Scenario: Checking if index exists
    Given an index "test-index" exists
    When I check if "test-index" exists
    Then it should return true

  Scenario: Getting an existing index
    Given an index "test-index" exists
    When I get the index definition
    Then it should return the correct definition

  Scenario: Getting non-existent index returns undefined
    When I get a non-existent index
    Then it should return undefined

  Scenario: Deleting an existing index
    Given an index "test-index" exists
    When I delete the index
    Then the index should not exist

  Scenario: Listing all index names
    Given multiple indexes exist
    When I list all indexes
    Then it should return all index names

  Scenario: Overwriting existing index
    Given an index exists
    When I create the same index with different fields
    Then the new definition should replace the old one
