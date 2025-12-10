Feature: Index Manager

  Scenario: Checking for non-existent index
    Given an IndexManager instance
    When I check if "non-existent" index exists
    Then it should return false

  Scenario: Checking for existing index
    Given an IndexManager instance with a test index
    When I check if "test-index" exists
    Then it should return true

  Scenario: Creating a new index
    Given an IndexManager instance
    When I create a new index with fields
    Then the index should exist

  Scenario: Overwriting existing index
    Given an IndexManager instance with a test index
    When I create the same index with different fields
    Then the new index definition should replace the old one

  Scenario: Getting non-existent index
    Given an IndexManager instance
    When I get a non-existent index
    Then it should return undefined

  Scenario: Getting existing index definition
    Given an IndexManager instance with a test index
    When I get the index definition
    Then it should return the correct index definition

  Scenario: Getting index fields
    Given an IndexManager instance with a test index
    When I get the index definition
    Then it should have 5 fields
    And the id field should be a key
    And the title field should be searchable
    And the price field should be sortable

  Scenario: Deleting an existing index
    Given an IndexManager instance with a test index
    When I delete the index
    Then the index should not exist

  Scenario: Deleting non-existent index
    Given an IndexManager instance
    When I delete a non-existent index
    Then it should not throw an error

  Scenario: Listing indexes when empty
    Given an IndexManager instance
    When I list all indexes
    Then it should return an empty array

  Scenario: Listing all index names
    Given an IndexManager instance with multiple indexes
    When I list all indexes
    Then it should return all index names

  Scenario: Listing indexes excludes deleted ones
    Given an IndexManager instance with multiple indexes
    When I delete one index and list all
    Then the deleted index should not be in the list

  Scenario: Getting all indexes when empty
    Given an IndexManager instance
    When I get all index definitions
    Then it should return an empty map

  Scenario: Getting all index definitions
    Given an IndexManager instance with multiple indexes
    When I get all index definitions
    Then it should return a map with all index definitions

  Scenario: Getting all returns a copy not internal map
    Given an IndexManager instance with a test index
    When I get all index definitions and modify the returned map
    Then the original index should still exist in the manager
