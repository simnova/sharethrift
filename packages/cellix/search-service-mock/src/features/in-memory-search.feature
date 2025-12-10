Feature: In-Memory Cognitive Search

  Scenario: Successfully creating an index
    When I create a test index
    Then the index should exist
    And the document count should be 0

  Scenario: Indexing a document
    Given a test index exists
    When I index a document
    Then the document count should be 1

  Scenario: Searching documents by text
    Given indexed documents exist
    When I search for "Test"
    Then I should find matching documents

  Scenario: Filtering documents
    Given multiple documents are indexed
    When I search with filter "category eq 'test'"
    Then I should find filtered results

  Scenario: Deleting a document
    Given an indexed document exists
    When I delete the document
    Then the document count should be 0

  Scenario: Handling pagination
    Given 5 documents are indexed
    When I search with skip 1 and top 2
    Then I should get 2 results
    And the total count should be 5

  Scenario: Indexing to non-existent index fails
    When I index a document to non-existent index
    Then an error should be thrown indicating index does not exist

  Scenario: Indexing document without id fails
    Given a test index exists
    When I index a document without an id
    Then an error should be thrown indicating id is required

  Scenario: Updating index preserves documents
    Given an indexed document exists
    When I update the index definition
    Then the document count should remain 1

  Scenario: Deleting an index
    Given a test index with documents exists
    When I delete the index
    Then the index should not exist
