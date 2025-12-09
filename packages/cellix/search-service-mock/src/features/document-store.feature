Feature: Document Store

  Scenario: Check for non-existent index
    When I check if index "non-existent" exists
    Then it should return false

  Scenario: Check for existing index
    Given an index "test-index" is created
    When I check if index "test-index" exists
    Then it should return true

  Scenario: Create a new index
    When I create an index "test-index"
    Then the index "test-index" should exist

  Scenario: Create index does not overwrite existing data
    Given an index "test-index" is created
    And a document "doc1" with title "Test" is added to "test-index"
    When I create an index "test-index" again
    Then the document count for "test-index" should be 1

  Scenario: Get documents from non-existent index
    When I get documents from index "non-existent"
    Then it should return an empty map

  Scenario: Get documents from existing index
    Given an index "test-index" is created
    And a document "doc1" is added to "test-index"
    When I get documents from index "test-index"
    Then it should return a map with 1 document

  Scenario: Set and get a document
    Given an index "test-index" is created
    When I set document "doc1" with data in "test-index"
    Then I should be able to get document "doc1" from "test-index"

  Scenario: Get non-existent document
    Given an index "test-index" is created
    When I get document "non-existent" from "test-index"
    Then it should return undefined

  Scenario: Remove a document
    Given an index "test-index" is created
    And a document "doc1" is added to "test-index"
    When I remove document "doc1" from "test-index"
    Then document "doc1" should not exist in "test-index"

  Scenario: Clear all documents
    Given an index "test-index" is created
    And documents are added to "test-index"
    When I clear "test-index"
    Then the document count for "test-index" should be 0

  Scenario: Get document count
    Given an index "test-index" is created
    And 3 documents are added to "test-index"
    Then the document count for "test-index" should be 3

  Scenario: Delete an index
    Given an index "test-index" is created
    When I delete "test-index"
    Then the index "test-index" should not exist

  Scenario: List all index names
    Given indexes "index1", "index2", "index3" are created
    When I list all index names
    Then it should return ["index1", "index2", "index3"]
